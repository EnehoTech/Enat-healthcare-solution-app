import {
  MdDashboard,
  MdEditNote,
  MdOfflinePin,
  MdOutlineGroups,
  MdOutlineHelp,
} from "react-icons/md";
import { BsArrowRepeat, BsBlockquoteLeft } from "react-icons/bs";
import { AiOutlineUsergroupAdd } from "react-icons/ai";


// Define common breadcrumb items
const commonDashboardBreadcrumbItems = [
  { label: "Dashboard", path: "/dashboard", behindIcon: <MdDashboard /> },
];



// Export the structured breadcrumb items, reusing common items
export const breadcrumbItems = {
  dashboard: {
    dashboard: [
      ...commonDashboardBreadcrumbItems, // Reuse common breadcrumb items
    ],
    addEmployee: [
      ...commonDashboardBreadcrumbItems,
      {
        label: "Add Employee",
        path: "/dashboard/sign-up",
        behindIcon: <AiOutlineUsergroupAdd />,
      },
    ],
    role: [
      ...commonDashboardBreadcrumbItems, // Reuse common breadcrumb items
      {
        label: "Manage Roles",
        path: "/dashboard/roles",
        behindIcon: <MdOfflinePin />,
      },
    ],
    assignRole: [
      ...commonDashboardBreadcrumbItems, // Reuse common breadcrumb items
      {
        label: "Assign Role",
        path: "/dashboard/assign-roles",
        behindIcon: <MdOfflinePin />,
      },
    ],
    team: [
      ...commonDashboardBreadcrumbItems, // Reuse common breadcrumb items
      {
        label: "Teams",
        path: "/dashboard/teams",
        behindIcon: <MdOutlineGroups />,
      },
    ],
    service: [
      ...commonDashboardBreadcrumbItems,
      {
        label: "Manage Services",
        path: "/dashboard/services",
        behindIcon: <BsArrowRepeat />,
      },
    ],
    blog: [
      ...commonDashboardBreadcrumbItems,
      {
        label: "Manage Blogs",
        path: "/dashboard/blogs",
        behindIcon: <MdEditNote />,
      },
    ],
    faq: [
      ...commonDashboardBreadcrumbItems,
      {
        label: "Manage FAQs",
        path: "/dashboard/faqs",
        behindIcon: <MdOutlineHelp />,
      },
    ],
    testimonial: [
      ...commonDashboardBreadcrumbItems,
      {
        label: "Manage Testimonials",
        path: "/dashboard/testimonials",
        behindIcon: <BsBlockquoteLeft />,
      },
    ],
  },
};
