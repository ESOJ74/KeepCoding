package io.keepcoding.spark.exercise.batch

import java.time.OffsetDateTime
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.Duration
import scala.concurrent.{Await, Future}
import org.apache.spark.sql.functions._
import org.apache.spark.sql.{DataFrame, SaveMode, SparkSession}
import org.apache.spark.sql.types.TimestampType

object BatchJob {

  def compBytes(dataFrame: DataFrame, column: String, metric: String, filterDate: OffsetDateTime): DataFrame = {

    import dataFrame.sparkSession.implicits._

    dataFrame
      .select(col(column).as("id"), $"bytes")
      .groupBy($"id")
      .agg(sum($"bytes").as("value"))
      .withColumn("tipo", lit(metric))
      .withColumn("timestamp", lit(filterDate.toEpochSecond).cast(TimestampType))
  }

  def storage(dataFrame: DataFrame, jdbcURI: String, jdbcTable: String, user: String, password: String, driver: String): Future[Unit] = Future {

    dataFrame
      .write
      .mode(SaveMode.Append)
      .format("jdbc")
      .option("driver", driver)
      .option("url", jdbcURI)
      .option("dbtable", jdbcTable)
      .option("user", user)
      .option("password", password)
      .save()
  }

  def run(args: Array[String]): Unit = {

    val filterDate = OffsetDateTime.parse(args(2))

    val spark = SparkSession.builder()
      .master("local[20]")
      .appName("Ejercicio Final")
      .getOrCreate()

    import spark.implicits._

    val user_metadata = spark
      .read
      .format("jdbc")
      .option("driver", args(5))
      .option("url", args(0))
      .option("dbtable", "user_metadata")
      .option("user", args(3))
      .option("password", args(4))
      .load()

    val device_data = spark
      .read
      .format("parquet")
      .option("path", s"${args(1) }/data")
      .load()
      .filter(
        $"year"   === filterDate.getYear &&
          $"month"  === filterDate.getMonthValue &&
          $"day"    === filterDate.getDayOfMonth &&
          $"hour"   === filterDate.getHour
      )
      .persist()

    val totalCountBytesAntena =
      compBytes(device_data, "id", "user_bytes_total", filterDate)
        .persist()

    val totalQuotaLimit =
      totalCountBytesAntena.as("user")
        .select($"id", $"value")
        .join(
          user_metadata.select($"id", $"email", $"quota").as("metadata"),
          $"user.id" === $"metadata.id" && $"user.value" > $"metadata.quota"
        )
        .select($"metadata.email", $"user.value".as("usage"), $"metadata.quota", lit(filterDate.toEpochSecond).cast(TimestampType).as("timestamp"))

    Await.result(
      Future.sequence(
        Seq(
          storage(
            compBytes(device_data, "antenna_id", "antenna_bytes_total", filterDate),
            args(0), "bytes_hourly", args(3), args(4), args(5)
          ),
          storage(
            compBytes(device_data, "app", "app_bytes_total", filterDate),
            args(0), "bytes_hourly", args(3), args(4), args(5)
          ),
          storage(totalCountBytesAntena, args(0), "bytes_hourly", args(3), args(4), args(5)),
          storage(totalQuotaLimit, args(0), "user_quota_limit", args(3), args(4), args(5))
        )
      ),
      Duration.Inf
    )

  }

  def main(args: Array[String]): Unit = run(args)

}