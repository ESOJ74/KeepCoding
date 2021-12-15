package io.keepcoding.spark.exercise.batch

import java.sql.Timestamp
import java.time.OffsetDateTime
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}

import org.apache.spark.sql.{DataFrame, SparkSession}

case class AntennaMessage(year: Int, month: Int, day: Int, hour: Int, timestamp: Timestamp, id: String, metric: String, value: Long)

trait BatchJob {

  val spark: SparkSession

  def readFromStorage(storagePath: String, filterDate: OffsetDateTime): DataFrame

  def readAntennaMetadata(jdbcURI: String, jdbcTable: String, user: String, password: String): DataFrame

  def enrichAntennaWithMetadata(antennaDF: DataFrame, metadataDF: DataFrame): DataFrame

  def computeDevicesCountByCoordinates(dataFrame: DataFrame): DataFrame

  def computeErrorAntennaByModelAndVersion(dataFrame: DataFrame): DataFrame

  def computePercentStatusByID(dataFrame: DataFrame): DataFrame

  def writeToJdbc(dataFrame: DataFrame, jdbcURI: String, jdbcTable: String, user: String, password: String): Unit

  def writeToStorage(dataFrame: DataFrame, storageRootPath: String): Unit

  def run(args: Array[String]): Unit = {
//    val Array(filterDate, storagePath, jdbcUri, jdbcMetadataTable, aggJdbcTable, aggJdbcErrorTable, aggJdbcPercentTable, jdbcUser, jdbcPassword) = args
//    println(s"Running with: ${args.toSeq}")

    val antennaDF = readFromStorage("/tmp/spark", OffsetDateTime.parse("2021-09-24T01:30:25Z"))
    val metadataDF = readAntennaMetadata("jdbc:postgresql://localhost:5432/postgres", "metadata", "postgres", "docker")
    val antennaMetadataDF = enrichAntennaWithMetadata(antennaDF, metadataDF).cache()
    val aggByCoordinatesDF = computeDevicesCountByCoordinates(antennaMetadataDF)
    val aggPercentStatusDF = computePercentStatusByID(antennaMetadataDF)
    val aggErroAntennaDF = computeErrorAntennaByModelAndVersion(antennaMetadataDF)

    writeToJdbc(aggByCoordinatesDF, "jdbc:postgresql://localhost:5432/postgres", "antenna_agg", "postgres", "docker")
    writeToJdbc(aggPercentStatusDF, "jdbc:postgresql://localhost:5432/postgres", "antenna_percent_agg", "postgres", "docker")
    //writeToJdbc(aggErroAntennaDF, "jdbc:postgresql://localhost:5432/postgres", "aggJdbcErrorTable", "postgres", "docker")

    writeToStorage(antennaDF, "/tmp/spark")

    spark.close()
  }

}
