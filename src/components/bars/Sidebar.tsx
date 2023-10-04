import { Link } from "react-router-dom";
import "../../css/sidebar.css";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from '@mui/icons-material/Close';

function Sidebar() {
  return (
    <nav id="sidebar">
      <div className="sidebar__burger-menu heading--large">
        <MenuIcon fontSize="inherit" />
      </div>
      {/* <div className="sidebar__burger-menu heading--large">
        <CloseIcon fontSize="inherit" />
      </div> */}
      <div id="sidebar__options">
        <div id="sidebar__options__top" className="heading--small">
          <Link className="sidebar__option heading--small" to="/">
            Home
            <div className="sidebar__arrow heading--large">
              <KeyboardArrowRightIcon fontSize="inherit" />
            </div>
          </Link>
          <Link className="sidebar__option heading--small" to="/employee-portal">
            EmployeePortal
            <div className="sidebar__arrow heading--large">
              <KeyboardArrowRightIcon fontSize="inherit" />
            </div>
          </Link>
          <Link className="sidebar__option heading--small" to="/office-details">
            Office Details
            <div className="sidebar__arrow heading--large">
              <KeyboardArrowRightIcon fontSize="inherit" />
            </div>
          </Link>
          <Link className="sidebar__option heading--small" to="/company101">
            Company 101
            <div className="sidebar__arrow heading--large">
              <KeyboardArrowRightIcon fontSize="inherit" />
            </div>
          </Link>
          <Link className="sidebar__option heading--small" to="/personal-skills">
            Personal Skills
            <div className="sidebar__arrow heading--large">
              <KeyboardArrowRightIcon fontSize="inherit" />
            </div>
          </Link>
          <Link className="sidebar__option heading--small" to="/expenses">
            Expenses
            <div className="sidebar__arrow heading--large">
              <KeyboardArrowRightIcon fontSize="inherit" />
            </div>
          </Link>
        </div>
        <div id="sidebar__options__bottom">
          <Link className="sidebar__option heading--small" to="/offices">
            Change Offices
            <div className="sidebar__arrow heading--large">
              <KeyboardArrowRightIcon fontSize="inherit" />
            </div>
          </Link>
          <Link className="sidebar__option heading--small" to="/settings">
            Settings
            <div className="sidebar__arrow heading--large">
              <KeyboardArrowRightIcon fontSize="inherit" />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;