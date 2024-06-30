import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Profile = () => {
  const token = useSelector((state) => state.auth.token);

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [imgUrl, setImgUrl] = useState('');

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const [completeProfile, setCompleteProfile] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async () => {
    setIsLoading(true);
    fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDQxqWAXQVnifXhqishJ95EfgRZb9DOkq0',
      {
        method: 'POST',
        body: JSON.stringify({
          idToken: token
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then((response) => {
      setIsLoading(false);
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((data) => {
          let errorMessage = 'Authentication failed!';
          if (data && data.error && data.error.message) {
            errorMessage = data.error.message;
          }
          throw new Error(errorMessage);
        });
      }
    }).then((data) => {
      console.log("Data", data);

      if (!data.photoUrl || !data.displayName) {
        setCompleteProfile(false);
      }
      setImgUrl(data.photoUrl);
      setEmail(data.email);
      setDisplayName(data.displayName);
      setIsEmailVerified(data.emailVerified);

    })
      .catch((error) => {
        alert(error.message);
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEmailEdit = () => {
    setIsEditingEmail(true);
    setNewEmail(email);
  };

  const handleEmailSave = () => {

    fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDQxqWAXQVnifXhqishJ95EfgRZb9DOkq0',
      {
        method: 'POST',
        body: JSON.stringify({
          idToken: token,
          email: newEmail,
          returnSecureToken: true
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((data) => {
          let errorMessage = 'Authentication failed!';
          if (data && data.error && data.error.message) {
            errorMessage = data.error.message;
          }
          throw new Error(errorMessage);
        });
      }
    }).then((data) => {
      console.log("Updated Email", data.email);
      setEmail(data.email);
      setIsEditingEmail(false);
    })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const emailVerifyHandler = () => {
    fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDQxqWAXQVnifXhqishJ95EfgRZb9DOkq0',
      {
        method: 'POST',
        body: JSON.stringify({
          requestType: "VERIFY_EMAIL",
          idToken: token,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((data) => {
          let errorMessage = 'Authentication failed!';
          if (data && data.error && data.error.message) {
            errorMessage = data.error.message;
          }
          throw new Error(errorMessage);
        });
      }
    }).then((data) => {
      console.log("Email verify", data)
      alert('Check your email , you might have recieved a verification link. Click on it to verify.');
    })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="container mt-5 vh-100">
      <div className="row justify-content-between">
        <div className="col-auto">
          <h2>Profile</h2>
        </div>
      </div>
      <div className="card shadow-lg">
        <div className="card-body">
          {!isLoading && (<div className="row">
            {completeProfile && (
              <>
                <div className="col-md-4">
                  <img src={imgUrl} alt="Profile" className="img-fluid rounded mb-3" style={{ width: '200px', height: '200px', borderRadius: '10px' }} />
                </div>
                <div className="col-md-8">
                  <h3 className="card-title">Profile Information</h3>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong className='me-2'>Email:</strong>
                      {isEditingEmail ? (
                        <div className="input-group">
                          <input
                            type="email"
                            className="form-control"
                            value={newEmail}
                            onChange={handleEmailChange}
                          />
                          <button className="btn btn-primary" onClick={handleEmailSave}>Save</button>
                        </div>
                      ) : (
                        <>
                          {email}
                          {isEmailVerified ? (
                            <span className="badge bg-success ms-2">Verified</span>
                          ) : (
                            <button className="btn btn-warning ms-2" onClick={emailVerifyHandler}>verify Email</button>
                          )}
                          <button className="btn btn-primary ms-2" onClick={handleEmailEdit}>Edit</button>
                        </>
                      )}
                    </li>
                    <li className="list-group-item">
                      <strong className='me-2'>Display Name:</strong>
                      {displayName}
                    </li>
                    <li className='list-group-item text-center'>
                      To update the profile.
                      <NavLink className='ms-2' to='/updateProfile'>Click here</NavLink>
                    </li>
                  </ul>
                </div>
              </>)}
            {!completeProfile && (
              <>
                <ul className="list-group list-group-flush text-center">
                  <li className="list-group-item">
                    <strong>Email:</strong>
                    {isEditingEmail ? (
                      <div className="input-group input-group-sm">
                        <input
                          type="email"
                          className="form-control"
                          value={newEmail}
                          onChange={handleEmailChange}
                        />
                        <button className="btn btn-primary" onClick={handleEmailSave}>Save</button>
                      </div>
                    ) : (
                      <>
                        {email}
                        {isEmailVerified ? (
                          <button className="btn btn-success ms-2">Verified</button>
                        ) : (
                          <button className="btn btn-warning ms-2" onClick={emailVerifyHandler}>verify Email</button>
                        )}
                        <button className="btn btn-primary" onClick={handleEmailEdit}>Edit</button>
                      </>
                    )}
                  </li>
                  <li className='list-group-item text-center'>
                    Your profile is incomplete.
                    <NavLink className='ms-2' to='/updateProfile'>Complete now</NavLink>
                  </li>
                </ul>
              </>)}
          </div>)}
          {isLoading && <div className="row">
            <h3 className='text-center'>Loading profile information...</h3>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default Profile;