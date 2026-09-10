import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-forest-100 dark:bg-forest-950 text-forest-600 dark:text-forest-400 flex items-center justify-center mx-auto shadow-sm">
          <Sprout className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-4xl sm:text-5xl font-black text-forest-700 dark:text-forest-400">
            404
          </span>
          <h1 className="text-2xl font-bold text-earth-900 dark:text-white">
            Produce Field Not Found
          </h1>
          <p className="text-sm text-earth-500 max-w-sm mx-auto">
            The agricultural page or crop listing you are searching for might have been moved, harvested, or does not exist.
          </p>
        </div>
        <Link to="/marketplace">
          <Button variant="primary" size="lg" icon={ArrowLeft}>
            Return to Marketplace
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
