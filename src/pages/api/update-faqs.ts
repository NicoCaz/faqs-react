import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { faqs } = req.body;

    if (!faqs) {
      console.error("No se recibieron FAQs en el body");
      return res
        .status(400)
        .json({ message: "No se recibieron FAQs en el body" });
    }

    const filePath = path.join(process.cwd(), "src/mock/faqs.json");
    console.log("Ruta del archivo:", filePath);

    // Verificar si el directorio existe
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      console.log("Creando directorio:", dirPath);
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Verificar permisos de escritura
    try {
      await fs.promises.access(dirPath, fs.constants.W_OK);
    } catch (error) {
      console.error("Error de permisos:", error);
      return res.status(500).json({
        message: "No hay permisos de escritura en el directorio",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }

    // Escribir el archivo JSON
    const jsonData = JSON.stringify({ faqs }, null, 2);
    console.log("Datos a escribir:", jsonData);

    try {
      await fs.promises.writeFile(filePath, jsonData, "utf8");
      console.log("Archivo escrito exitosamente");
      return res.status(200).json({
        success: true,
        message: "FAQs updated successfully",
      });
    } catch (writeError) {
      console.error("Error al escribir el archivo:", writeError);
      return res.status(500).json({
        success: false,
        message: "Error writing file",
        error:
          writeError instanceof Error ? writeError.message : "Unknown error",
      });
    }
  } catch (error) {
    console.error("Error detallado:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating FAQs",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
