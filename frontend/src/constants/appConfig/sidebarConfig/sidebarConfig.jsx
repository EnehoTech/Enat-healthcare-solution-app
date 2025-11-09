import {
  MdDashboard,
  MdEditNote,
  MdOutlineHelp,
  MdOfflinePin,
  MdOutlineGroups,
} from "react-icons/md";
// import { GiTakeMyMoney } from "react-icons/gi";
import { BiSolidPhoneCall } from "react-icons/bi";
import { BsBlockquoteLeft, BsArrowRepeat } from "react-icons/bs";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoAnalytics } from "react-icons/io5";

export const sidebarConfig = {
  dashboardSidebar: [
    {
      label: "Dashboard",
      icon: <MdDashboard className="sidebar-icon" />,
      path: "/dashboard",
      roles: [0, 1, 2, 3, 4, 5],
    },
    {
      label: "Manage Employees",
      icon: <AiOutlineUsergroupAdd className="sidebar-icon" />,
      path: "/dashboard/roles",
      roles: [0, 1, 2, 3, 4, 5],
      subItems: [
        {
          label: "Add Employee",
          path: "/dashboard/sign-up",
          roles: [0, 1, 2, 3, 4, 5],
        },
      ],
    },
    {
      label: "Manage Roles",
      icon: <MdOfflinePin className="sidebar-icon" />,
      path: "/dashboard/roles",
      roles: [0, 1, 2, 3, 4, 5],
      subItems: [
        { label: "Roles", path: "/dashboard/roles", roles: [0, 1, 2, 3, 4, 5] },
        {
          label: "Assign Role",
          path: "/dashboard/assign-roles",
          roles: [0, 1, 2, 3, 4, 5],
        },
      ],
    },
    {
      label: "Manage Teams",
      icon: <MdOutlineGroups className="sidebar-icon" />,
      path: "/dashboard/teams",
      roles: [0, 1, 2, 3, 4, 5],
      subItems: [
        { label: "Teams", path: "/dashboard/teams", roles: [0, 1, 2, 3, 4, 5] },
      ],
    },

    {
      label: "Analytics",
      icon: <IoAnalytics className="sidebar-icon" />,
      path: "#",
      roles: [0, 1, 2, 3, 4, 5],
      subItems: [
        { label: "General Analytics", path: "#", roles: [0, 1, 2, 3, 4, 5] },
        {
          label: "Appointment Analytics",
          path: "#",
          roles: [0, 1, 2, 3, 4, 5],
        },
        { label: "Patient Analytics", path: "#", roles: [0, 1, 2, 3, 4, 5] },
      ],
    },

    // Pages Section with nested items and individual roles
    {
      label: "Pages",
      items: [
        {
          _id: 1,
          name: "Services",
          icon: <BsArrowRepeat className="sidebar-icon" />,
          path: "/dashboard/services",
          roles: [0, 1, 2, 3, 4, 5],
        },
        {
          _id: 2,
          name: "Blogs",
          icon: <MdEditNote className="sidebar-icon" />,
          path: "/dashboard/blogs",
          roles: [0, 1, 2, 3, 4, 5],
        },
        {
          _id: 3,
          name: "FAQs",
          icon: <MdOutlineHelp className="sidebar-icon" />,
          path: "/dashboard/faqs",
          roles: [0, 1, 2, 3, 4, 5],
        },
        {
          _id: 4,
          name: "Testimonials",
          icon: <BsBlockquoteLeft className="sidebar-icon" />,
          path: "/dashboard/testimonials",
          roles: [0, 1, 2, 3, 4, 5],
        },
        {
          _id: 7,
          name: "Contact",
          icon: <BiSolidPhoneCall className="sidebar-icon" />,
          path: "/contact",
          roles: [0, 1, 2, 3, 4, 5],
        },
      ],
      roles: [0, 1, 2, 3, 4, 5],
    },
  ],
};
