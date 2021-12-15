package io.keepcoding.spark.exercise.streaming

import org.apache.spark.sql.catalyst.ScalaReflection

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{Await, Future}
import org.apache.spark.sql.{DataFrame, SaveMode, SparkSession}
import org.apache.spark.sql.functions._
import org.apache.spark.sql.types.{LongType, StringType, StructField, StructType, TimestampType}

import java.sql.Timestamp
import scala.concurrent.duration.Duration

object StreamingJob {

  case class Message(bytes: Long,timestamp: Long,app: String, id: String, antenna_id: String)

  def bytesTotales(
                    dataFrame: DataFrame,
                    column: String,
                    jdbcURI: String,
                    user: String,
                    password: String,
                    driver: String): Future[Unit] = Future
  {
    import dataFrame.sparkSession.implicits._

    dataFrame
      .select($"timestamp".cast(TimestampType).as("timestamp"), col(column), $"bytes")
      .withWatermark("timestamp", "6 minutes")
      .groupBy(window($"timestamp", "5 minutes"), col(column))
      .agg(sum($"bytes").as("total_bytes"))
      .select(
        $"window.start".cast(TimestampType).as("timestamp"),
        col(column).as("id"),
        $"total_bytes".as("value"),
        lit(s"${column}_total_bytes").as("tipo")
      )
      .writeStream
      .foreachBatch((dataset: DataFrame, batchId: Long) =>
        dataset
          .write
          .mode(SaveMode.Append)
          .format("jdbc")
          .option("driver", driver)
          .option("url", jdbcURI)
          .option("dbtable", "bytes")
          .option("user", user)
          .option("password", password)
          .save()
      )
      .start()
      .awaitTermination()
  }

  def run(args: Array[String]): Unit = {

    val spark = SparkSession
      .builder()
      .master("local[20]")
      .appName("Ejercicio Final")
      .getOrCreate()

    import spark.implicits._

    val schema: StructType = ScalaReflection.schemaFor[Message].dataType.asInstanceOf[StructType]

    val device = spark
      .readStream
      .format("kafka")
      .option("kafka.bootstrap.servers", args(0))
      .option("subscribe", "devices")
      .option("startingOffsets", "earliest")
      .load()
      .select(from_json($"value".cast(StringType), schema).as("json"))
      .select($"json.*")

    val storage = Future {
      device
        .select(
          $"id", $"antenna_id", $"bytes", $"app",
          year($"timestamp".cast(TimestampType)).as("year"),
          month($"timestamp".cast(TimestampType)).as("month"),
          dayofmonth($"timestamp".cast(TimestampType)).as("day"),
          hour($"timestamp".cast(TimestampType)).as("hour")
        )
        .writeStream
        .partitionBy("year", "month", "day", "hour")
        .format("parquet")
        .option("path", s"${args(2)}/data")
        .option("checkpointLocation", s"${args(2)}/checkpoint")
        .start()
        .awaitTermination()
    }

    Await.result(
      Future.sequence(
        Seq(
          bytesTotales(device, "app", args(1), args(3), args(4), args(5)),
          bytesTotales(device.withColumnRenamed("id", "user"), "user", args(1), args(3), args(4), args(5)),
          bytesTotales(device.withColumnRenamed("antenna_id", "antenna"), "antenna", args(1), args(3), args(4), args(5)),
          storage
        )
      ),
      Duration.Inf
    )

  }

  def main(args: Array[String]): Unit = run(args)

}