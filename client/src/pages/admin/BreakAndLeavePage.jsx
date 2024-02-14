import BreaksTable from "../../components/Admin/BreaksTable";
import LeavesTable from "../../components/Admin/LeavesTable";

const BreaksPage = () => {
    return (
        <div>
            <BreaksTable />
            <hr className='mt-20' />
            <LeavesTable/>
        
        </div>
    );
}
export default BreaksPage;