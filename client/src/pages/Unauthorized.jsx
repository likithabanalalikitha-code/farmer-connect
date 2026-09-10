import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

const Unauthorized = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-earth-900 dark:text-white">
            Access Restricted
          </h1>
          <p className="text-sm text-earth-500 max-w-sm mx-auto">
            You do not have the required role permissions to view this administrative or farmer management section.
          </p>
        </div>
        <Link to="/marketplace">
          <Button variant="primary" size="md" icon={ArrowLeft}>
            Return to Marketplace
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
