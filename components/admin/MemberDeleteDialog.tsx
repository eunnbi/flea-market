import SimpleDialog from "@components/common/SimpleDialog"
import { alertMessageState } from "@store/admin/alertMessageState";
import { memberDeleteState } from "@store/admin/memberDeleteState";
import { membersState } from "@store/admin/membersState";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";

const MemberDeleteDialog = () => {
    const setMembers = useSetRecoilState(membersState);
    const setAlertMessage = useSetRecoilState(alertMessageState);
    const [{ open, id }, setMemberDeleteState] = useRecoilState(memberDeleteState);
    const handleClose = () => setMemberDeleteState(state => ({ ...state, open: false }));
    const deleteMember = async () => {
        await axios.delete(`/api/user/${id}`);
        const { data } = await axios.get('/api/user');
        setMembers(data);
        setAlertMessage('삭제가 완료되었습니다.');
    };
    return (
        <SimpleDialog
            open={open}
            handleClose={handleClose}
            onConfirm={deleteMember}
            basicTitle="정말 삭제하시겠습니까?"
            loadingTitle="삭제 중..."
            content="유저 관련 데이터도 전부 삭제됩니다."
        />
    )
}

export default MemberDeleteDialog;