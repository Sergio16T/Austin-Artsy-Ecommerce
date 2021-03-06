import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag'; 
import Router from 'next/router'; 
import { StyledForm, StyledFormWrapper } from './styles/FormStyles'; 
import { ALL_ITEMS_QUERY } from './Items';
import Spinner from './Spinner'; 
import { UploadPhotosDropNClick } from './Photos'; 

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: {id: $id}) {
            id
            title
            price 
            description
            image
            largeImage
        }
    }
`; 
const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String
        $price: Int 
        $description: String
        $image: [String]
        $largeImage: [String]
        ) {
        updateItem(
            id: $id
            title: $title
            price: $price
            description: $description
            image: $image
            largeImage: $largeImage
            )
            {
                id
            }
        }
`; 

class UpdateItem extends Component {
    state = {
        title: '', 
        price: 0, 
        description: '',
        image: [],
        largeImage: [],
        errorMessage: '',
        spinner: false
    }
    updateItem = async (e, updateItemMutation) => {
        let regEx2= /^\d+(\.\d{0,1})$/; 
        const setPrice = regEx2.test(this.state.price) ? this.state.price.toFixed(2) : this.state.price; 
        e.preventDefault(); 
        this.setState({ spinner: true }); 
        const res = await updateItemMutation({
            variables: {
            id: this.props.id, 
            ...this.state, 
            price: setPrice * 100,
            }
        }); 
        this.setState({spinner: false }); 
        console.log(res); 
        Router.push({
            pathname: "/items"
        }); 
    }
    handleUpload = async (data) => {
        let images = [...this.state.image]; 
        let largeImages = [...this.state.largeImage]; 
        if(largeImages.length >= 6) return; 
        this.setState({ spinner: true }); 
        try {
            const res = await fetch('https://api.cloudinary.com/v1_1/dddnhychw/image/upload', {
                method: 'POST', 
                body: data  
            }); 
            const file = await res.json(); 
            if(file.hasOwnProperty('error')) throw file.error.message; 

            images.push(file.secure_url); 
            largeImages.push(file.eager[0].secure_url); 
            this.setState({
                image: images, 
                largeImage: largeImages, 
                spinner: false,
                fileError: ''
            }); 
            this.fileInput.value= ""; 
        }
        catch(err) {
            console.log(err); 
            this.setState({
                fileError: err, 
                spinner: false
            }); 
            return; 
        }
    }
    dropFile = (files) => {
        if(!files.length) {
            this.setState({ fileError: 'No Files Provided'}); 
            return; 
        }
        this.setState({ spinner: true }); 
        const data = new FormData(); 
        data.append('file', files[0]); 
        data.append('upload_preset', 'AustinArts'); 
        this.handleUpload(data); 
    }
    uploadFile = (e) => {
        console.log('uploading file'); 
        const files = e.target.files; 
        const data = new FormData(); 
        data.append('file', files[0]); 
        data.append('upload_preset', 'AustinArts'); 
        this.handleUpload(data); 
    
    }
    handleInput = (e) => {
        let regEx = /^\d+(\.\d{0,2})?$/; 
        const { value, type, name } = e.target; 
        let val = type === 'number' && value.length ? parseFloat(value) : value; 
        //console.log(regEx.test(val)); 
        try {
            if ((typeof val === 'number') && !regEx.test(val)) {
                throw new Error('Only two decimal points please'); 
            }
        }
        catch(err) {
            console.log(err.message);
            this.setState({
                errorMessage: err.message
            }); 
        }
        if ((typeof val === 'number') && regEx.test(val)) {
            this.setState({
                errorMessage: ''
            }); 
        }
        this.setState({
            [name]: val
        }); 
    }
    deletePhoto = (index) => {
        console.log(index); 
        const images = [...this.state.image]; 
        const largeImages = [...this.state.largeImage]; 
        images.splice(index, 1); 
        largeImages.splice(index,1); 

        this.setState({
            image: images, 
            largeImage: largeImages
        }); 
    }
    render() {
        const { errorMessage } = this.state; 
        return (
            <StyledFormWrapper>
                <div className="formContainer">
                    <Query query={SINGLE_ITEM_QUERY} variables={{id: this.props.id}} 
                    onCompleted={data => this.setState({
                        title: data.item.title,
                        price: data.item.price /100, 
                        description: data.item.description, 
                        image: data.item.image, 
                        largeImage: data.item.largeImage
                    })}>
                        {({data, error, loading})=> {
                            if(loading) return null; 
                            if(error) return <p>{error.message}</p>
                            return (
                            <Mutation mutation={UPDATE_ITEM_MUTATION} 
                            variables={this.state}
                            refetchQueries={[{ query: ALL_ITEMS_QUERY }]}
                            >
                                {(updateItem, {error, loading}) => (
                                <StyledForm 
                                onSubmit = {async (e) => {
                                    this.updateItem(e, updateItem); 
                                }} 
                                errorMessage={errorMessage}>
                                    <Spinner spinner={this.state.spinner}/>
                                    <fieldset disabled={loading}>
                                        <div className="formheader">
                                            <h1 id="form_H1">Updating {this.state.title}</h1>
                                        </div>
                                        <div className="formRow">
                                            <div className="formCol-1">
                                                <div className="imageContainer">
                                                    <UploadPhotosDropNClick
                                                    inputRef={(el) => this.fileInput = el}
                                                    dropFile={this.dropFile}
                                                    uploadFile={this.uploadFile}
                                                    image={this.state.image}
                                                    largeImage={this.state.largeImage}
                                                    description={this.state.description}
                                                    deletePhoto={this.deletePhoto}
                                                    fileError={this.state.fileError}
                                                    />
                                                </div>
                                            </div>
                                            <div className="formCol-2">
                                                {/* <h2>Item Details</h2> */}
                                                {/* <h2>Update Item</h2> */}
                                                <label htmlFor="title">
                                                    Title
                                                    <input 
                                                    type="text"
                                                    name="title"
                                                    id="title"
                                                    defaultValue={data.item.title}
                                                    // placeholder="title"
                                                    onChange={this.handleInput}
                                                    />
                                                </label>
                                                <label htmlFor="price" id="priceLabel">
                                                    {errorMessage ? errorMessage : "Price"} 
                                                    <input
                                                    type="number"
                                                    name="price"
                                                    id="price"
                                                    step=".01"
                                                    defaultValue={(data.item.price/100)}
                                                    // placeholder="price"
                                                    onChange={this.handleInput}
                                                    />
                                                </label>
                                                <label htmlFor="description">
                                                Description
                                                <textarea
                                                name="description"
                                                id="description"
                                                defaultValue={data.item.description}
                                                // placeholder="Enter a Description"
                                                onChange={this.handleInput}
                                                />
                                                </label>
                                            </div>
                                        </div>
                                        <button type="submit" disabled={this.state.errorMessage ? true : false} aria-disabled={this.state.errorMessage ? true : false}>Save Changes</button>
                                    </fieldset>
                                </StyledForm>
                                )}
                            </Mutation>
                        )}}
                    </Query>
                </div>
            </StyledFormWrapper>
        );
    }
}

export default UpdateItem;
export { SINGLE_ITEM_QUERY }; 