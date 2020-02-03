import React, { Component } from 'react'; 
import Link from 'next/link'; 
import { StyledItem } from './styles/ItemStyles'; 
import styled from 'styled-components'; 
import FormayMoney from '../lib/formatMoney'; 
import formatMoney from '../lib/formatMoney';

const Title = styled.div`
    a { 
        font-size: 1.5rem; 
    }
`; 
const ItemButtons = styled.div`
    display: grid; 
    grid-template-columns: 1fr 1fr 1fr; 
    border-top: 1px solid #E1E1E1;
    border-bottom: 1px solid #E1E1E1; 
    grid-gap: 1px; 
    background: #E1E1E1;
    button { 
        cursor: pointer; 
        padding: 10px; 
        border: none; 
    }
    #editButton {
        background: white; 
        padding: 10px; 
    }
`; 
class Item extends Component {
   constructor(props) {
       super(props); 
   }
    render() {
        const { item } = this.props; 
        return (
                <StyledItem>
                    {item.image && <img src={item.image} alt={item.title}/>}
                    <Title>
                        <Link href={{
                            pathname: "/item", 
                            query: {id: item.id}
                        }}>
                            <a>{item.title}</a>
                        </Link>
                    </Title>
                    <p>{item.description}</p>
                    <p>{formatMoney(item.price)}</p>
                    <ItemButtons>
                        <Link href={{
                            pathname: '/update', 
                            query: {id: item.id}
                        }}>
                            <a id="editButton"> Edit </a>
                        </Link>
                        <button>Add to Cart</button>
                        <button>Delete</button>
                    </ItemButtons>
                </StyledItem>
                
        );
    }
}

export default Item;