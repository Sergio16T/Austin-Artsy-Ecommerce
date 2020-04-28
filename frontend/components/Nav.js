import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; 
import { Mutation } from 'react-apollo'; 
import gql from 'graphql-tag'; 
import { CURRENT_USER_QUERY } from './User'; 
import Link from 'next/link'; 
import StyledNav from "./styles/NavStyles"; 
import User from './User'; 
import calculateCartNumer from '../lib/calculateCartNumber'; 

const SIGNOUT_MUTATION = gql`
    mutation SIGNOUT_MUTATION {
        signout {
            message
        }
    }
`; 


const Nav = props => {
    const router = useRouter();   
    let isMounted = false; 
    useEffect(() => {
        isMounted = true; 
        if(isMounted) {
            let slidingBars = document.querySelectorAll('.slidingBar'); 
            let navLink = document.getElementById(`${router.pathname}`); 
            slidingBars.forEach(bar => bar.classList.remove('underline')); 
            if(document.contains(navLink)) {
            navLink.classList.add('underline'); 
            }   
        }
       return () => isMounted = false; 
    });

    return (
        <User>
        {({data, error, loading })=> {
            if(loading) return null; 
            const { user } = data; 
            return ( 
                <StyledNav 
                pathName = {router.pathname}
                navBarColor={props.navBarColor} 
                className="navbar" 
                openDropDown={props.openDropDown} 
                id={`mobileOpen${props.openDropDown}`}
                data-test="nav">
                    {props.width < 1000 && (
                        <Link href="/">
                            <li onClick={props.openMobileMenu}>
                            <a>Home</a>
                            <div className="slidingBar" id="/"></div>
                        </li>
                        </Link>
                    )}
                    {/* <Link href="/about">
                        <li onClick={props.openMobileMenu}>
                            <a>About Us</a>
                            <div className="slidingBar" id="/about"></div>
                        </li>
                    </Link> */}
                    {user && 
                    <>
                    <Link href="/items">
                        <li onClick={props.openMobileMenu}>
                            <a>Shop</a>
                            <div className="slidingBar" id="/items"></div>
                        </li>
                    </Link>
                    <Link href="/sell">
                        <li onClick={props.openMobileMenu}>
                            <a>Sell</a>
                            <div className="slidingBar" id="/sell"></div>
                        </li>  
                    </Link>
                    <Link href="/orders">
                        <li onClick={props.openMobileMenu}>
                            <a>Orders</a>
                            <div className="slidingBar" id="/orders"></div>
                        </li>
                    </Link>
                    </>
                    }

                    <Link href="/contact">
                        <li onClick={props.openMobileMenu}>
                            <a data-testid="contact">Contact</a>
                            <div className="slidingBar" id="/contact"></div>
                        </li>
                    </Link>
                    {!user && 
                    <Link href="/signup">
                        <li onClick={props.openMobileMenu}>
                            <a data-testid="login">Log In</a>
                            <div className="slidingBar" id="/signup"></div>
                        </li>
                    </Link>
                    } 
                    {/* <Link href="/signin">
                        <li onClick={props.openMobileMenu}>
                            <a>Sign In</a>
                            <div className="slidingBar" id="/signin"></div>
                        </li>
                    </Link> */}
                    {user && 
                    <Mutation mutation={SIGNOUT_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
                        {(signout) => (
                            <li onClick={ async () => {
                                await signout(); 
                                props.openMobileMenu()}}>
                            <a>Sign Out</a>
                            <div className="slidingBar" id="/signout"></div>
                            </li>
                        )}
                    </Mutation> 
                }
                {router.pathname === "/items" || router.pathname ==="/item" ?  
                    <CartIcons
                    toggleCart={props.toggleCart}
                    toggleSearchBar={props.toggleSearchBar}
                    user={user}
                    />
                    : null
                    }
                    <div id="socialListContainer">
                    <SocialMediaIcon
                    alt="linkedin"
                    aria="linkedin"
                    path="M30.07-10.9v-.076a.92.92 0 01-.05.077h.05zM3.977 17.558H.12V5.95h3.857zM2.047 4.364h-.024C.728 4.364-.11 3.474-.11 2.36-.11 1.22.755.353 2.075.353s2.132.866 2.158 2.005c0 1.113-.84 2.004-2.184 2.004zM17.89 17.558h-3.857v-6.21c0-1.56-.558-2.626-1.954-2.626-1.067 0-1.7.718-1.98 1.412-.103.247-.128.593-.128.94v6.484H6.114s.05-10.52 0-11.608H9.97v1.643c.514-.79 1.43-1.917 3.48-1.917 2.537 0 4.44 1.66 4.44 5.225v6.66z"
                    navBarColor={props.navBarColor}
                    />
                    <SocialMediaIcon
                    alt="instagram"
                    aria="instagram"
                    path="M127.999746,23.06353 C162.177385,23.06353 166.225393,23.1936027 179.722476,23.8094161 C192.20235,24.3789926 198.979853,26.4642218 203.490736,28.2166477 C209.464938,30.5386501 213.729395,33.3128586 218.208268,37.7917319 C222.687141,42.2706052 225.46135,46.5350617 227.782844,52.5092638 C229.535778,57.0201472 231.621007,63.7976504 232.190584,76.277016 C232.806397,89.7746075 232.93647,93.8226147 232.93647,128.000254 C232.93647,162.177893 232.806397,166.225901 232.190584,179.722984 C231.621007,192.202858 229.535778,198.980361 227.782844,203.491244 C225.46135,209.465446 222.687141,213.729903 218.208268,218.208776 C213.729395,222.687649 209.464938,225.461858 203.490736,227.783352 C198.979853,229.536286 192.20235,231.621516 179.722476,232.191092 C166.227425,232.806905 162.179418,232.936978 127.999746,232.936978 C93.8200742,232.936978 89.772067,232.806905 76.277016,232.191092 C63.7971424,231.621516 57.0196391,229.536286 52.5092638,227.783352 C46.5345536,225.461858 42.2700971,222.687649 37.7912238,218.208776 C33.3123505,213.729903 30.538142,209.465446 28.2166477,203.491244 C26.4637138,198.980361 24.3784845,192.202858 23.808908,179.723492 C23.1930946,166.225901 23.0630219,162.177893 23.0630219,128.000254 C23.0630219,93.8226147 23.1930946,89.7746075 23.808908,76.2775241 C24.3784845,63.7976504 26.4637138,57.0201472 28.2166477,52.5092638 C30.538142,46.5350617 33.3123505,42.2706052 37.7912238,37.7917319 C42.2700971,33.3128586 46.5345536,30.5386501 52.5092638,28.2166477 C57.0196391,26.4642218 63.7971424,24.3789926 76.2765079,23.8094161 C89.7740994,23.1936027 93.8221066,23.06353 127.999746,23.06353 M127.999746,0 C93.2367791,0 88.8783247,0.147348072 75.2257637,0.770274749 C61.601148,1.39218523 52.2968794,3.55566141 44.1546281,6.72008828 C35.7374966,9.99121548 28.5992446,14.3679613 21.4833489,21.483857 C14.3674532,28.5997527 9.99070739,35.7380046 6.71958019,44.1551362 C3.55515331,52.2973875 1.39167714,61.6016561 0.769766653,75.2262718 C0.146839975,88.8783247 0,93.2372872 0,128.000254 C0,162.763221 0.146839975,167.122183 0.769766653,180.774236 C1.39167714,194.398852 3.55515331,203.703121 6.71958019,211.845372 C9.99070739,220.261995 14.3674532,227.400755 21.4833489,234.516651 C28.5992446,241.632547 35.7374966,246.009293 44.1546281,249.28042 C52.2968794,252.444847 61.601148,254.608323 75.2257637,255.230233 C88.8783247,255.85316 93.2367791,256 127.999746,256 C162.762713,256 167.121675,255.85316 180.773728,255.230233 C194.398344,254.608323 203.702613,252.444847 211.844864,249.28042 C220.261995,246.009293 227.400247,241.632547 234.516143,234.516651 C241.632039,227.400755 246.008785,220.262503 249.279912,211.845372 C252.444339,203.703121 254.607815,194.398852 255.229725,180.774236 C255.852652,167.122183 256,162.763221 256,128.000254 C256,93.2372872 255.852652,88.8783247 255.229725,75.2262718 C254.607815,61.6016561 252.444339,52.2973875 249.279912,44.1551362 C246.008785,35.7380046 241.632039,28.5997527 234.516143,21.483857 C227.400247,14.3679613 220.261995,9.99121548 211.844864,6.72008828 C203.702613,3.55566141 194.398344,1.39218523 180.773728,0.770274749 C167.121675,0.147348072 162.762713,0 127.999746,0 Z M127.999746,62.2703115 C91.698262,62.2703115 62.2698034,91.69877 62.2698034,128.000254 C62.2698034,164.301738 91.698262,193.730197 127.999746,193.730197 C164.30123,193.730197 193.729689,164.301738 193.729689,128.000254 C193.729689,91.69877 164.30123,62.2703115 127.999746,62.2703115 Z M127.999746,170.667175 C104.435741,170.667175 85.3328252,151.564259 85.3328252,128.000254 C85.3328252,104.436249 104.435741,85.3333333 127.999746,85.3333333 C151.563751,85.3333333 170.666667,104.436249 170.666667,128.000254 C170.666667,151.564259 151.563751,170.667175 127.999746,170.667175 Z M211.686338,59.6734287 C211.686338,68.1566129 204.809755,75.0337031 196.326571,75.0337031 C187.843387,75.0337031 180.966297,68.1566129 180.966297,59.6734287 C180.966297,51.1902445 187.843387,44.3136624 196.326571,44.3136624 C204.809755,44.3136624 211.686338,51.1902445 211.686338,59.6734287 Z"
                    viewBox="0 0 256 256"
                    navBarColor={props.navBarColor}
                    />
                    <SocialMediaIcon
                    alt="twitter"
                    aria="twitter"
                    path="M18 3.418a7.332 7.332 0 01-2.12.58 3.7 3.7 0 001.623-2.042 7.413 7.413 0 01-2.345.896 3.693 3.693 0 00-2.696-1.166A3.692 3.692 0 008.865 6.22a10.485 10.485 0 01-7.612-3.86 3.692 3.692 0 001.143 4.93 3.687 3.687 0 01-1.673-.46v.047c0 1.79 1.273 3.28 2.963 3.62a3.673 3.673 0 01-1.668.064 3.697 3.697 0 003.45 2.565 7.416 7.416 0 01-4.587 1.58c-.296 0-.59-.017-.88-.05a10.46 10.46 0 005.66 1.658c6.795 0 10.51-5.627 10.51-10.507 0-.16-.004-.32-.01-.478A7.526 7.526 0 0018 3.416z"
                    navBarColor={props.navBarColor}
                    />
                    <SocialMediaIcon
                    alt="github"
                    aria="github"
                    path="M12.11 10.28c-.702 0-1.272.79-1.272 1.76 0 .974.57 1.762 1.272 1.762.702 0 1.27-.788 1.27-1.76.002-.973-.568-1.76-1.27-1.76zm4.428-4.58c.145-.358.152-2.387-.62-4.33 0 0-1.772.194-4.453 2.034C10.903 3.248 9.95 3.17 9 3.17s-1.902.078-2.465.233C3.855 1.563 2.083 1.37 2.083 1.37c-.773 1.943-.766 3.972-.62 4.33C.553 6.685 0 7.87 0 9.486c0 7.03 5.832 7.143 7.304 7.143h3.392c1.472 0 7.304-.115 7.304-7.145 0-1.617-.554-2.8-1.462-3.786zm-7.51 10.064h-.055c-3.69 0-6.564-.44-6.564-4.026 0-.86.302-1.656 1.022-2.318 1.2-1.103 3.233-.52 5.54-.52h.055c2.306 0 4.34-.582 5.54.52.72.662 1.023 1.46 1.023 2.318 0 3.586-2.873 4.026-6.562 4.026zM5.89 10.28c-.702 0-1.27.79-1.27 1.76 0 .974.568 1.762 1.27 1.762.703 0 1.272-.788 1.272-1.76 0-.973-.57-1.76-1.272-1.76z"
                    navBarColor={props.navBarColor}
                    />
                    </div>
                </StyledNav>
            )}}
        </User>
         
    );
};
const CartIcons = (props) => {
    if(!props.user) return null; 
    return (
        <React.Fragment>
            <li id="cart">
                <a className="feature_icons" onClick={() => props.toggleCart(true)}>
                    <img id="cartImage" src="https://cdn.shopify.com/s/files/1/0558/4169/t/138/assets/icon-cart.svg?v=4915344247293215888" alt="cart" />
                    <span id="cartCount">{calculateCartNumer(props.user.cart)}</span>
                </a>
            </li>
            <li id="searchIconContainer" >
                <a onClick={props.toggleSearchBar}><img src="https://cdn.shopify.com/s/files/1/0558/4169/t/138/assets/icon-search.svg?v=12627112760336229118"></img></a> 
            </li>
         </React.Fragment>
    ); 
}
const SocialMediaIcon = (props) => {
    return (
        <li className="socialListItem">
            <a
            alt={props.alt} 
            aria-label={props.aria}
            href="/" 
            rel="noopener" 
            target="_blank"> 
            {props.viewBox ? (
            <svg 
            className="social-media-list__icon" 
            xmlns="http://www.w3.org/2000/svg" 
            height="18" 
            width="18"
            viewBox={props.viewBox}
            >
            <path fill="currentColor" d={props.path}></path>
            </svg> 
            )
            : ( 
            <svg 
            className="social-media-list__icon" 
            xmlns="http://www.w3.org/2000/svg" 
            height="18" 
            width="18">
            <path fill="currentColor" d={props.path}></path>
            </svg> 
            )}
            </a>
        </li>
    ); 
}

export default Nav;
export { CartIcons }; 