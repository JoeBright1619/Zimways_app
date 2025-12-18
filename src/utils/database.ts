import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // or wherever your Firebase setup is

const vendorData = {
  vendorId: 'seller002',
  vendorName: "Sharon's zone Rwandex",
  vendorType: 'Restaurant',
  productDesc:
    'American, African, Sandwitches, Burgers, Healthy, Fast food, Chicken, Salads, Affordable Meal, Breakfast',
  rating: 4.9,
  phone: '+250788421072',
  address: 'kicukiro, Kigali',
  bio: "Sharon's zone here to deliver a delicious satisfaction.",
  createdAt: new Date().toISOString(),
};

const addVendorToFirestore = async () => {
  try {
    await setDoc(doc(db, 'vendors', vendorData.vendorId), vendorData);
    console.log('Vendor added successfully');
  } catch (error) {
    console.error('Error adding vendor: ', error);
  }
};

const productData = {
  productId: 'product004',
  vendorId: 'seller002',
  productName: 'chicken BOGOF with a shake',
  description:
    '2 chicken burgers Served with one plate  of fries and a choice of fresh Passion or trees tomato juice',
  price: 8000,
  category: [
    'Fast Food',
    'Sandwitches',
    'Healthy',
    'promo',
    'American',
    'burgers',
  ],
  rating: 4.7,
  imageUrl: 'sharonburger.png', // Replace with actual image URL
  createdAt: new Date().toISOString(),
  available: true,
};

const addProductToFirestore = async () => {
  try {
    await setDoc(doc(db, 'products', productData.productId), productData);
    console.log('Product added successfully');
  } catch (error) {
    console.error('Error adding product: ', error);
  }
};

const addOrderToFirestore = async (userId = 'user001') => {
  const orderData = {
    orderId: 'order001',
    userId,
    vendorId: 'seller001',
    products: ['product001', 'product002'],
    delivery_fee: 2000,
    container_fee: 1000,
    orderDate: new Date().toISOString(),
    quantity: 2,
    totalPrice: 19000,
    orderStatus: 'Pending',
    deliveryAddress: 'KN 5 st, Remera, Kigali',
    paymentMethod: 'Cash on Delivery',
  };

  try {
    await setDoc(doc(db, 'orders', orderData.orderId), orderData);
    console.log('Order added successfully');
  } catch (error) {
    console.error('Error adding order: ', error);
  }
};

export { addVendorToFirestore, addProductToFirestore, addOrderToFirestore };
