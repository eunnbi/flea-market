import { NextApiRequest, NextApiResponse } from 'next';
import { deleteProduct, updateProduct } from '@db/product';
import { getImageById, deleteImage } from '@db/image';
import cloudinary from '@lib/cloudinary';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'DELETE': {
        const { id } = req.query;
        const product = await deleteProduct(id as string);
        const response = await getImageById(product.imageId);
        await cloudinary.v2.uploader.destroy(response!.publicId, () => {});
        const image = await deleteImage(product.imageId);
        return res.json({ product, image });
      }
      case 'PATCH': {
        const { id } = req.query;
        const product = await updateProduct(id as string, req.body);
        return res.json(product);
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
