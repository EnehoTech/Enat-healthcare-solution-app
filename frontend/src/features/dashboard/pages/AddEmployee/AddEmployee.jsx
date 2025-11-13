import React from 'react'
import SideBar from '../../components/SideBar/SideBar';
import { sidebarConfig } from '../../../../constants/appConfig/sidebarConfig/sidebarConfig';
import AddEmployeeForm from '../../components/AddEmployeeForm/AddEmployeeForm';
import BackToTop from '../../../../shared/components/BackToTop/BackToTop';

function AddEmployee() {
  return (
    <>
      <SideBar sidebarConfig={sidebarConfig?.dashboardSidebar} />
      <AddEmployeeForm />
      <BackToTop />
    </>
  );
}

export default AddEmployee