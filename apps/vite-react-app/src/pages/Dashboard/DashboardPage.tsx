import { useAuth } from '@/hooks/useAuth';
import DashboardServices from './DashboardServices';
import DashboardBanner from './DashboardBanner';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className='flex flex-col gap-4'>
            {/* Services Section */}
            <DashboardServices user={user} />

            {/* Banner Section */}
            <DashboardBanner />
        </div>
    );
};

export default Dashboard;