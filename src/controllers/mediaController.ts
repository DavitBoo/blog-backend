// controllers/mediaController.ts
import { Request, Response } from "express";
import { supabase } from "../utils/supabase";
import { v4 as uuidv4 } from "uuid";

// subir imagenes a supabase
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    console.log(req);
    //     {
    //   fieldname: 'file',
    //   originalname: 'photo.png',
    //   encoding: '7bit',
    //   mimetype: 'image/png',
    //   buffer: <Buffer 89 50 4e 47 ...>,
    //   size: 123456
    // }

    if (!file) {
      res.status(400).json({ error: "no file provided" });
      return;
    }

    const fileExt = file.originalname.split(".").pop(); // I might get the original file name, but I will keep it like this
    const fileName = `${uuidv4()}.${fileExt}`;

    const { error: bucketError } = await supabase.storage.getBucket("media");
    if (bucketError) {
      console.error("Bucket error:", bucketError.message);
      res.status(500).json({ error: "Storage bucket 'media' not found, create it first." });
      return;
    }

    const { error: uploadError } = await supabase.storage.from("media").upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

    if (uploadError) {
      console.error("Error uploading to Supabase:", uploadError.message);
      res.status(500).json({ error: "Error uploading image" });
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(fileName);

    res.status(201).json({
      success: true,
      fileName,
      url: publicUrlData?.publicUrl,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Error in uploadImage:", error);
    if (!res.headersSent) {
      const message = error instanceof Error ? error.message : "Failed to upload image";
      res.status(500).json({ error: message });
    }
  }
};

// listar todas las imagenes export
export const listImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.storage.from("media").list("", {
      // public policy for SELECT media
      limit: 100, //  I think 100 is fine for now, but I'll end up listing all of them
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });


    if (error) {
      console.error("Error listing images:", error.message);
      res.status(500).json({ error: "Error listing images" });
      return;
    }

    // ! install supabase types like this better??? https://supabase.com/docs/guides/api/rest/generating-types
    // ! the "any" type below should be removed

    const imagesWithUrls = data.map((file: any) => {
      const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(file.name);

      return {
        name: file.name,
        url: publicUrlData?.publicUrl,
        created_at: file.created_at,
        updated_at: file.updated_at,
        size: file.metadata?.size,
      };
    });

    res.status(200).json({
      success: true,
      images: imagesWithUrls,
      count: imagesWithUrls.length,
    });

  } catch (error) {
    console.error("Error in listImages:", error);
    const message = error instanceof Error ? error.message : "Failed to list images";
    res.status(500).json({ error: message });
  }
};

export const getImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileName } = req.params;

    const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(fileName);

    if (!publicUrlData?.publicUrl) {
      res.status(404).json({ error: "Image not found" });
      return;
    }

    res.status(200).json({
      success: true,
      fileName,
      url: publicUrlData.publicUrl,
    });
  } catch (error) {
    console.error("Error in getImage:", error);
    const message = error instanceof Error ? error.message : "Failed to get image";
    res.status(500).json({ error: message });
  }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileName } = req.params;

    const { error } = await supabase.storage.from("media").remove([fileName]);

    if (error) {
      console.error("Error deleting image:", error.message);
      res.status(500).json({ error: "Error deleting image" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      fileName,
    });
  } catch (error) {
    console.error("Error in deleteImage:", error);
    const message = error instanceof Error ? error.message : "Failed to delete image";
    res.status(500).json({ error: message });
  }
};

export const deleteMultipleImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileNames } = req.body;

    if (!Array.isArray(fileNames) || fileNames.length === 0) {
      res.status(400).json({ error: "fileNames array is required" });
      return;
    }

    const { error } = await supabase.storage.from("media").remove(fileNames);

    if (error) {
      console.error("Error deleting images:", error.message);
      res.status(500).json({ error: "Error deleting images" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Images deleted successfully",
      count: fileNames.length,
    });
  } catch (error) {
    console.error("Error in deleteMultipleImages:", error);
    const message = error instanceof Error ? error.message : "Failed to delete images";
    res.status(500).json({ error: message });
  }
};
