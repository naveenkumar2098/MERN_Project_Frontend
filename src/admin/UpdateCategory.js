import React, { useState, useEffect } from 'react'
import Base from '../core/Base';
import {isAuthenticated} from '../auth/helper'
import { Link } from 'react-router-dom';
import { getCategory, updateCategory } from './helper/adminapicall'

const UpdateCategory = ({match}) => {
    
    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const { user, token } = isAuthenticated();

    const goBack = () => (
        <div className="mt-4">
            <Link className="btn btn-sm btn-success mb-3"
                to="/admin/dashboard"
            >
                Admin Home
            </Link>
        </div>
    );

    const handleChange = event => {
        setError("");
        setName(event.target.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setError("");
        setSuccess(false);
        //backend request fired...
        //TDOD: fix the update category method...
        updateCategory(match.params.categoryId, user._id, token, {name})
            .then(data => {
                if(data.error){
                    setError(true);
                }else{
                    setError("");
                    setSuccess(true);
                    setName("");
                }
            })
            .catch(err => console.log(err));
    };

    const preload = (categoryId) => {
        getCategory(categoryId).then(data => {
            if(data.error){
                setError(true);
            }else{
                setError("");
                setSuccess("");
                setName(data.name)
            }
        })
    }

    useEffect(() => {
        preload(match.params.categoryId)
    }, []);

    const successMessage = () => {
        if(success){
            return(
                <h4 className="text-success">Category updated successfully</h4>
            )
        }
    }

    const errorMessage = () => {
        if(error){
            return <h4 className="text-success">Failed to update category</h4>
        }
    }
    
    const newCategoryForm = () => (
        <form>
            <div className="form-group">
                <p className="lead">Enter category</p>
                <input type="text"
                    className="form-control my-3"
                    onChange={handleChange}
                    value={name}
                    autoFocus
                    required
                    placeholder="For ex. Summer"
                />
                <button onClick={onSubmit} className="btn btn-outline-success">Update Category</button>
            </div>
        </form>
    );
    
    return (
        <Base 
            title="Update a category"
            description="Update an existing category of product"
            className="container bg-success p-4"
        >
            <div className="row bg-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {errorMessage()}
                    {newCategoryForm()}
                    {goBack()}
                </div>
            </div>
        </Base>
    )
}

export default UpdateCategory;
