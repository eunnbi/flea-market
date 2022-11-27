import { NextApiRequest, NextApiResponse } from 'next';
import { deleteUser, updateUser } from '@db/user';
import { deleteProductsBySeller, getProductBySeller } from '@db/product';
import { deleteImage } from '@db/image';
import { deleteShoppingByProduct, deleteShoppingByUser } from '@db/shopping';
import { deleteWishByProduct, deleteWishByUser } from '@db/wish';
import { deleteBiddingByProduct, deleteBiddingByUser } from '@db/bidding';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'DELETE': {
        // Delete an existing user
        const { id } = req.query;
        const user = await deleteUser(id as string);

        if (user.role === 'SELLER') {
          // delete products of user
          const products = await getProductBySeller(id as string);
          await deleteProductsBySeller(id as string);
          products.forEach(async ({ id, imageId }) => {
            await deleteImage(imageId);
            await deleteWishByProduct(id);
            await deleteShoppingByProduct(id);
            await deleteBiddingByProduct(id);
          });
        } else if (user.role === 'BUYER') {
          // delete data at bidding, shopping, and wishlist table
          await deleteShoppingByUser(id as string);
          await deleteWishByUser(id as string);
          await deleteBiddingByUser(id as string);
        }
        return res.json(user);
      }
      case 'PATCH': {
        // Update an existing user
        const { id } = req.query;
        const user = await updateUser(id as string, req.body);
        return res.json(user);
      }
      default:
        break;
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message });
  }
}
