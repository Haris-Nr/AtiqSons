import BreaksTable from "../components/common/BreaksTable";
import LeavesTable from "../components/common/LeavesTable";

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