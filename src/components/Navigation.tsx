import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation: React.FC = () => {
    return (
        <nav className="navigation">
            <ul>
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>Home</NavLink>
                </li>
                <li>
                    <NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>Work</NavLink>
                </li>
                <li>
                    <NavLink to="/blog" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>My Thoughts</NavLink>
                </li>
                <li>
                    <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>About</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;