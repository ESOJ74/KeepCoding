package io.keepcoding.spark.structured.streaming.exercise4

import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.types.{IntegerType, StructField, StructType, TimestampType}

object Deduplication {

  def main(args: Array[String]): Unit = {

    val spark = SparkSession
      .builder()
      .master("local[*]")
      .appName("Spark Structured Streaming KeepCoding Base")
      .getOrCreate()

    val archivePath = "/media/jose/Repositorio/KeepCoding/Full Stack Big Data, AI & Machine Learning 8/big-data-processing/spark/spark-structured-streaming/spark_structured_streaming_base_solutions/src/main/resources/exercise4/archive"

    val schema = StructType(Seq(
      StructField("sensor_id", IntegerType, nullable = false),
      StructField("temperature", IntegerType, nullable = false),
      StructField("humidity", IntegerType, nullable = false),
      StructField("timestamp", TimestampType, nullable = false)
    ))

      spark
        .readStream
        .format("json")
        .option("cleanSource", "archive")
        .option("sourceArchiveDir", archivePath)
        .option("mode", "DROPMALFORMED")
        .schema(schema)
        .load("/media/jose/Repositorio/KeepCoding/Full Stack Big Data, AI & Machine Learning 8/big-data-processing/spark/spark-structured-streaming/spark_structured_streaming_base_solutions/src/main/resources/exercise4/input")
        .withWatermark("timestamp", "30 seconds")
        .dropDuplicates("sensor_id", "timestamp")
        .writeStream
        .format("console")
        .start()
        .awaitTermination()


    spark.close()
  }

}
