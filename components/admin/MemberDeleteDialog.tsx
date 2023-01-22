import SimpleDialog from "@components/common/SimpleDialog";
import { alertMessageState } from "@store/admin/alertMessageState";
import { membersState } from "@store/admin/membersState";
import { userAPI } from "@api/user";
import { useSetRecoilState } from "recoil";

interface Props {
  id: string;
  handleClose: () => void;
}

const MemberDeleteDialog = ({ id, handleClose }: Props) => {
  const setMembers = useSetRecoilState(membersState);
  const setAlertMessage = useSetRecoilState(alertMessageState);
  const deleteMember = async () => {
    await userAPI.deleteUser(id);
    const { data } = await userAPI.getUsers();
    setMembers(data);
    setAlertMessage("삭제가 완료되었습니다.");
  };
  return (
    <SimpleDialog
      open={true}
      handleClose={handleClose}
      onConfirm={deleteMember}
      basicTitle="정말 삭제하시겠습니까?"
      loadingTitle="삭제 중..."
      content="유저 관련 데이터도 전부 삭제됩니다."
    />
  );
};

export default MemberDeleteDialog;
