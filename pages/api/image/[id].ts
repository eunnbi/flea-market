import { NextApiRequest, NextApiResponse } from "next";
import { getImageById, deleteImage } from "@db/image";
import cloudinary from "@lib/cloudinary";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "DELETE": {
        const { id } = req.query;
        const response = await getImageById(id as string);
        await cloudinary.v2.uploader.destroy(response!.publicId, () => {});
        await deleteImage(id as string);
        return res.json({ success: true });
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
