import history from '../history';
import auth0 from 'auth0-js';
import { CONFIG } from '../config-variables';
import axios from 'axios';

/***
AUTHO SAMPLE CODE LICENSE – IMPERSONATION
Background: You have asked Auth0, Inc. (“Auth0”) to provide you with certain sample software code to assist you in your design, implementation and/or maintenance of impersonation functionality as part of your use of the Auth0 Identity Management Platform as a Service (the “Impersonation Project”).
Disclaimer: IMPORTANT:  Any Auth0 sample code software provided to you in connection with the Impersonation Project (the "Sample Code") is supplied to you in consideration of your agreement to the following terms, and your use, installation, modification or redistribution of the Sample Code constitutes acceptance of and is subject to these terms.  If you do not agree with these terms, you may not use, install, modify or redistribute the Sample Code.
  In consideration of your agreement to abide by the following terms, and subject to these terms, Auth0 grants you a worldwide, perpetual, non-exclusive, non-transferable, paid-up, royalty-free license, without right to sub-license, under Auth0's copyrights in the Sample Code, to use, reproduce, modify and redistribute the Sample Code, with or without modifications, in source and/or binary forms; provided that if you redistribute the Sample Code in any form, you must retain this notice and the following text and disclaimers in all such redistributions of the Sample Code. Neither the name, trademarks, service marks or logos of Auth0 Inc. may be used to endorse or promote products or services derived from the Sample Code.  Except as expressly stated in this notice, no other rights or licenses, express or implied, are granted by Auth0 herein.
This Sample Code is supplied to you at your request, to assist you with the Impersonation Project as part of your use of the Auth0 Identity Management Platform as a Service. You acknowledge and agree that (i) Auth0 recommends against implementation or use of impersonation functionality on information security grounds, (ii) Auth0 will have no liability for any unauthorized use of or access to any systems or data that arises out of such implementation or use, including without limitation out of any use, reproduction, modification or redistribution of some or all of this Sample Code, (iii) you are solely responsible for assessing and mitigating the risks associated with your use, reproduction, modification or redistribution of some or all of this Sample Code and the Impersonation Project, and (iv) you assume all of such risks.
  The Sample Code is provided by Auth0 on an "AS IS" basis.  AUTH0 MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OF NON-INFRINGEMENT, MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE, REGARDING THE SAMPLE CODE OR ITS USE AND OPERATION ALONE OR IN COMBINATION WITH YOUR PRODUCTS AND/OR SERVICES.
  IN NO EVENT SHALL AUTH0 BE LIABLE FOR ANY DIRECT, SPECIAL, INDIRECT, INCIDENTAL OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) ARISING IN ANY WAY OUT OF THE USE, REPRODUCTION, MODIFICATION AND/OR DISTRIBUTION OF THE AUTH0 SOFTWARE, HOWEVER CAUSED AND WHETHER UNDER THEORY OF CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY OR OTHERWISE, EVEN IF AUTH0 HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  Claims arising under these terms will be governed by the laws of Washington, U.S.A., excluding its principles of conflict of laws and the United Nations Convention on Contracts for the Sale of Goods.
  In the event of any conflict between the provisions of these terms and any other agreement or contract between you and Auth0, the provisions of these terms prevail.

Copyright (C) 2018 Auth0, Inc. All Rights Reserved.
 */
export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: CONFIG.domain,
    clientID: CONFIG.clientId,
    redirectUri: CONFIG.callbackUrl,
    audience: CONFIG.audience,
    responseType: 'token id_token',
    scope: 'openid profile'
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getUser = this.getUser.bind(this);
    this.setProfile = this.setProfile.bind(this);

    this.state = {};
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace('/home');
      } else if (err) {
        history.replace('/home');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  setProfile(profile, expires_at) {
    this.state = {
      profile: {
        sub: profile.user_id,
        ...profile
      },
      expires_at
    };
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expires_at = (authResult.expiresIn * 1000) + new Date().getTime();
    let profile = authResult.idTokenPayload;

    this.state = {
      access_token: authResult.accessToken,
      profile,
      expires_at
    };

    axios.defaults.headers.common.Authorization = `Bearer ${authResult.accessToken}`;

    // navigate to the home route
    history.replace('/home');
  }

  logout() {
    // Clear access token and ID token from local storage
    this.state = {
      access_token: undefined,
      profile: undefined,
      expires_at: undefined
    };

    axios.defaults.headers.common.Authorization = 'N/A';
    // redirect to auth0 to log out
    window.location = `http://${CONFIG.domain}/v2/logout?returnTo=http://localhost:3000`;
  }

  isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    let expiresAt = this.state.expires_at;
    return new Date().getTime() < expiresAt;
  }

  getUser() {
    return this.state.profile && this.state.profile.sub;
  }
}
