import React from 'react'
import Menu from './Menu'

const Base = ({
    title = "My Title",
    description = "My Description",
    className = "bg-dark text-white p-4",
    children
}) => (
    <div>
        <Menu />
        <div className="container-fluid">
            <div className="jumbotron bg-dark text-white text-center">
                <h2 className="display-4">{title}</h2>
                <p className="lead">{description}</p>
            </div>
            <div className={className}>
                {children}
            </div>
        </div>
        <footer className="footer mt-auto py-3 bg-dark">
            <div className="container-fluid bg-success text-white text-center py-3">
                <h4>Got Any Queries, Feel Free To Reach Out</h4>
                <button className="btn btn-warning btn-lg">Contact Us</button>
            </div>
        </footer>         
    </div>
)


export default Base;
