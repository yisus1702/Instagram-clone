import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import useSearchFollowersAndFollowing from "../../hooks/useSearchFollowersAndFollowing";
import { useEffect } from "react";
import SearchFollowersAndFollowing from "../SuggestedUsers/SearchFollowersAndFollowing";

const FollowersDetails = ({ isOpen, onClose, title, userIds }) => {
  const { users, isLoading, getUserProfilesByIds } =
    useSearchFollowersAndFollowing();
  useEffect(() => {
    if (isOpen && userIds.length > 0) {
      getUserProfilesByIds(userIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInLeft">
      <ModalOverlay />
      <ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {isLoading ? (
            <p>Loading users...</p>
          ) : users.length > 0 ? (
            users.map((user) => (
              <SearchFollowersAndFollowing key={user.uid} user={user} />
            ))
          ) : (
            <p>No users found.</p>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FollowersDetails;
