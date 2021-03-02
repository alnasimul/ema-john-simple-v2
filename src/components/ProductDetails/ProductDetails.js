import React from 'react';
import { useParams } from 'react-router-dom';
import fakeData from '../../fakeData';
import Product from '../Product/Product';

const ProductDetails = () => {
    let {productKey} = useParams();
    let product = fakeData.find(pd => pd.key === productKey);
    //console.log(product);
    return (
        <div>
            <h1>Product Details Coming Soon</h1>
            <Product showAddProduct = {false} product={product}></Product>
        </div>
    );
};

export default ProductDetails;