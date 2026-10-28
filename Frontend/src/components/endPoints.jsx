class APIEndpoints {
    constructor() {
      // this.BASE_URL ="http://localhost:8000";
      this.BASE_URL = "https://api.techkisan.in"; 
      
      this.DOWNLOAD_INVOICE=`${this.BASE_URL}/download_invoice`
     this.GET_MESSAGES=`${this.BASE_URL}/messages`
     this.CREATE_TICKET=`${this.BASE_URL}/ticket/create_ticket`
     this.GET_EMPLOYEE_IMAGE=`${this.BASE_URL}/employees/get_image`
     this.EMPLOYEE_UPDATE=`${this.BASE_URL}/employee-update`
     this.FETCH_TICKETS=`${this.BASE_URL}/ticket/get_tickets`
     this.FETCH_MY_TICKETS=`${this.BASE_URL}/ticket/get_my_tickets`
     this.DELETE_TICKET=`${this.BASE_URL}/ticket/delete_ticket`
     this.EDIT_TICKET=`${this.BASE_URL}/ticket/edit_ticket`
     this.ASSIGNED_AGENT=`${this.BASE_URL}/ticket/assigned_agent`
     this.FETCH_ASSIGNED_AGENT=`${this.BASE_URL}/ticket/get_assigned_agent`
     this.GET_ALL_MANAGERS=`${this.BASE_URL}/getmanagers`
     this.FETCH_UNREAD_MESSAGES=`${this.BASE_URL}/unread_messages`
     this.MARK_MESSAGE_AS_READ=`${this.BASE_URL}/messages/mark-read`
    this.UNREAD_MESSAGE_COUNT=`${this.BASE_URL}/unread-messages-count`
      // Admin Endpoints
      this.ADMIN_LOGIN = `${this.BASE_URL}/admin/login`;
      this.ADMIN_DASHBOARD = `${this.BASE_URL}/admin/admindata`;
      this.ADMIN_ADD_ANNOUNCEMENT = `${this.BASE_URL}/admin/add_announcement`;
      this.ADMIN_DELETE_ANNOUNCEMENT = `${this.BASE_URL}/admin/delete_announcement`;
      this.ADMIN_UPDATE_ANNOUNCEMENT = `${this.BASE_URL}/admin/update_announcement`;
      this.ADMIN_SAVE_NOTAXINVOICE = `${this.BASE_URL}/admin/save_notaxinvoice`;
      this.ADMIN_FETCH_LATEST_NOTAXINVOICE_ID = `${this.BASE_URL}/admin/invoice/latest`;
      this.ADMIN_FETCH_LATEST_TAXINVOICE_ID = `${this.BASE_URL}/admin/taxinvoice/latest`;
      this.ADMIN_FETCH_LATEST_SOLARINVOICE_ID = `${this.BASE_URL}/admin/solarinvoice/latest`;
      this.ADMIN_SAVE_TAXINVOICE = `${this.BASE_URL}/admin/save_taxinvoice`;
      this.ADMIN_SAVE_SOLARINVOICE = `${this.BASE_URL}/admin/save_solarinvoice`;
      this.ADMIN_DELETE_EMPLOYEE=`${this.BASE_URL}/admin/delete_employee`;
      this.ADMIN_DELETE_INVOICE=`${this.BASE_URL}/admin/delete_invoice`
      //Quotation Endpoints
      this.ADMIN_FETCH_LATEST_TAXQUOTATION_ID=`${this.BASE_URL}/admin/taxquotation/latest`;
      this.ADMIN_SAVE_TAXQUOTATION=`${this.BASE_URL}/admin/save_taxquotation`;
      this.ADMIN_FETCH_LATEST_NOTAXQUOTATION_ID=`${this.BASE_URL}/admin/notaxquotation/latest`;
      this.ADMIN_SAVE_NOTAXQUOTATION=`${this.BASE_URL}/admin/save_notaxquotation`;

   


  
      // Employee Endpoints
      this.EMPLOYEE_CREATE = `${this.BASE_URL}/employees/create`;
      this.EMPLOYEE_LOGIN = `${this.BASE_URL}/employees/login`;
      this.EMPLOYEE_DASHBOARD = `${this.BASE_URL}/employees/empdata`;
      this.EMPLOYEE_CHANGEPASSWORD = `${this.BASE_URL}/employees/changepassword`;
      this.EMPLOYEE_WFH = `${this.BASE_URL}/employees/addWfh`;
      this.EMPLOYEE_ADD_LEAVE = `${this.BASE_URL}/employees/addLeave`;
      this.EMPLOYEE_GET_LEAVES = `${this.BASE_URL}/employees/getLeaves`;
      this.EMPLOYEE_PUNCH_IN = `${this.BASE_URL}/employees/punchIn`;
      this.EMPLOYEE_PUNCH_OUT = `${this.BASE_URL}/employees/punchOut`;
      this.EMPLOYEE_DEL_LEAVE = `${this.BASE_URL}/employees/deleteLeaves`;
      this.EMPLOYEE_LOGOUT = `${this.BASE_URL}/employees/logout`;  
      this.GET_USERS_EMPLOYEES=`${this.BASE_URL}/employees/allusers`  
      this.GET_UNREADMESSAGE_EMPLOYEES=`${this.BASE_URL}/employees/unreadmessages`  
      // Manager Endpoints
      this.MANAGER_CREATE = `${this.BASE_URL}/manager/create`;
      this.MANAGER_LOGIN = `${this.BASE_URL}/manager/login`;
      this.MANAGER_DASHBOARD = `${this.BASE_URL}/manager/managerdata`;
      this.MANAGER_PUNCH_IN = `${this.BASE_URL}/manager/punchIn`;
      this.MANAGER_PUNCH_OUT = `${this.BASE_URL}/manager/punchOut`;
      this.MANAGER_GET_PENDING_LEAVES = `${this.BASE_URL}/manager/pendingleaves`;
      this.MANAGER_APPROVE_LEAVE = `${this.BASE_URL}/manager/leaves/approve`;
      this.MANAGER_DENY_LEAVE = `${this.BASE_URL}/manager/leaves/deny`;
      this.MANAGER_LOGOUT = `${this.BASE_URL}/manager/logout`;
      this.GET_USERS_MANAGER=`${this.BASE_URL}/manager/allusers` 
      // Intern Endpoints
      this.INTERN_CREATE = `${this.BASE_URL}/intern/create`;
      this.INTERN_LOGIN = `${this.BASE_URL}/intern/login`;
      this.INTERN_DASHBOARD = `${this.BASE_URL}/intern/interndata`;
      this.INTERN_LOGOUT = `${this.BASE_URL}/intern/logout`;
      this.GET_USERS_INTERN=`${this.BASE_URL}/intern/allusers`
      this.GET_USER_GROUPS = `${this.BASE_URL}/groups/user`;
      this.CREATE_GROUP = `${this.BASE_URL}/groups/create`;
      this.GET_GROUP_MESSAGES = `${this.BASE_URL}/groups/messages`;
      this.ADD_GROUP_MEMBER = `${this.BASE_URL}/groups`;  // /:groupId/members
      this.REMOVE_GROUP_MEMBER = `${this.BASE_URL}/groups`; // /:groupId/members/:userId
    }
  }
  
  
  export default APIEndpoints; 