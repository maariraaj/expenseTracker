import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const UpdateProfile = () => {
  const token = useSelector((state) => state.auth.token);

  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handlePhotoURLChange = (e) => {
    setPhotoURL(e.target.value);
  };

  const handleUpdate = () => {

    console.log('Full Name:', fullName);
    console.log('Profile Photo URL:', photoURL);
    fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDQxqWAXQVnifXhqishJ95EfgRZb9DOkq0',
      {
        method: 'POST',
        body: JSON.stringify({
          idToken: token,
          displayName: fullName,
          photoUrl: photoURL,
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
      console.log("Data", data);
    })
      .catch((error) => {
        alert(error.message);
      });
    setFullName('');
    setPhotoURL('');
    navigate('/profile')
  };

  const handleCancel = () => {
    setFullName('');
    setPhotoURL('');
    navigate('/profile')
  };
  const isDisabled = !fullName || !photoURL;

  return (
    <div className="container mt-5 vh-100">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-lg">
            <div className="card-body p-5">
              <h3 className="card-title text-center mb-4">Contact Details</h3>
              <form onSubmit={handleUpdate}>
                <div className="form-group mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={handleFullNameChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="photoURL" className="form-label">Profile Photo URL</label>
                  <input
                    type="url"
                    className="form-control"
                    id="photoURL"
                    placeholder="Enter profile photo URL"
                    value={photoURL}
                    onChange={handlePhotoURLChange}
                    required
                  />
                </div>
                <div className="card-body text-center">
                  <button type="button" className="btn btn-primary me-2" onClick={handleUpdate} disabled={isDisabled}>Update</button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default UpdateProfile