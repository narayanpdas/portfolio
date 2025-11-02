import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation: React.FC = () => {
    return (
        <nav className="navigation">
            <ul>
                <li>
                    <NavLink to="/portfolio/home" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>Home</NavLink>
                </li>
                <li>
                    <NavLink to="/portfolio/projects" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>Work</NavLink>
                </li>
                <li>
                    <NavLink to="/portfolio/blog" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>My Thoughts</NavLink>
                </li>
                <li>
                    <NavLink to="/portfolio/about" className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}>About</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;