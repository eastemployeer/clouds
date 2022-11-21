import React, { useCallback } from "react";
import { Link, Navigate, NavLink, useNavigate } from "react-router-dom";
import { Menu, Image, Button } from "semantic-ui-react";
import useLocalUser from "../hooks/useLocalUser";
import "./Layout.scss";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {  
    const {logout} = useLocalUser(false);
    const navigate = useNavigate();

    const onLogout = useCallback(() => {
        logout();
        navigate('/')
    }, [logout, navigate])
    
  return (
    <div className={"Layout"}>
        <Menu className="mainMenu grey"
              secondary
              size="massive"
              inverted
              attached>
          <Menu.Item header as={Link} to="/tic">
            Tic tac toe
          </Menu.Item>
          <Menu.Item position="right" as={Link} to="/leaderboard">
            Leaderboard
          </Menu.Item>
          <Menu.Item position="right" as={Button} onClick={onLogout}>
            Logout
          </Menu.Item>
        </Menu>
        <div className="contentContainer">
          <div className="content">
            {children}
          </div>
        </div>
    </div>
  );
}
