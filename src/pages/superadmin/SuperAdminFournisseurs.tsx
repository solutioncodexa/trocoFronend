import { Navigate } from 'react-router-dom';

/** Liste + création : même écran que le dashboard plateforme. */
const SuperAdminFournisseurs = () => {
  return <Navigate to="/super-admin/dashboard" replace />;
};

export default SuperAdminFournisseurs;
