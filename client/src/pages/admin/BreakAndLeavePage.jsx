import BreaksTable from '../../components/admin/BreaksTable';
import LeavesTable from '../../components/admin/LeavesTable';

const BreaksPage = () => {
    return (
        <div>
            <BreaksTable />
            <hr className='mt-20' />
            <LeavesTable />
        </div>
    );
}
export default BreaksPage;