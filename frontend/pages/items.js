import React from 'react';
import Items from '../components/Items'; 
import PleaseSignIn from '../components/PleaseSignIn'; 

const ItemsPage = props => {
    return (
        <PleaseSignIn>
            <Items 
            toggleCart={props.toggleCart}
            page={parseFloat(props.query.page)|| 1}
            />
        </PleaseSignIn> 
    );
};


export default ItemsPage;