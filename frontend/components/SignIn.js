import React, { Component } from 'react';
import {StyledForm} from './styles/FormStyles'; 
import { Mutation } from 'react-apollo'; 
import gql from 'graphql-tag'; 
import { CURRENT_USER_QUERY } from './User'; 
import Spinner from './styles/Spinner';  

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION($email: String!, $password: String!) {
        signin(email: $email, password: $password) {
            id
            name 
            email
        }
    }
`;


class SignIn extends Component {
    state = {
        email: '',
        password: '',
        spinner: false,
      }
      handleInput = (e) => {
        const {name, value} = e.target; 
        this.setState({
          [name]: value, 
        }); 
      }
    render() {
        return (
            <Mutation 
            mutation={SIGNIN_MUTATION} 
            variables={this.state}
            refetchQueries={[{ query: CURRENT_USER_QUERY} ]}>
                {(signin, {error, loading})=> {
                    return (
                    <StyledForm method="post" onSubmit={async (e) => {
                        e.preventDefault(); 
                        this.setState({spinner: true }); 
                        const res = await signin(); 
                        this.setState({
                        password: '', 
                        email: ''
                        }); 
                        this.setState({ spinner: false})
                    }} >
                        <Spinner spinner={this.state.spinner}/>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <h2>Sign in</h2>
                            <label htmlFor="email">
                                Email
                                <input
                                type ="text" 
                                // id ="email" 
                                name="email" 
                                placeholder="Enter your email address" 
                                value={this.state.email}
                                onChange={this.handleInput}
                                />
                            </label>
                            <label htmlFor="password">
                                Password
                                <input
                                type ="password" 
                                // id ="password" 
                                name="password" 
                                placeholder="Password" 
                                value={this.state.password}
                                onChange={this.handleInput}
                                required  
                                />
                            </label>
                            <button type="submit" > Sign In </button>
                        </fieldset>
                    </StyledForm>
                    )}}
            </Mutation>
        );
    }
}

export default SignIn;