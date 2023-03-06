import {
  IoDocumentTextOutline,
  IoHomeOutline,
  IoInformationCircleOutline
} from "react-icons/io5"
import { ReactComponent as PeopleIcon } from "../../../assets/images/people.svg"

const routes = [
  {
    name: "Home",
    pathname: "/home",
    Icon: IoHomeOutline
  },
  {
    name: "My Buddies",
    to: "my-buddies",
    pathname: "/home/my-buddies",
    Icon: PeopleIcon
  },
  {
    name: "Documents",
    to: "documents",
    pathname: "/home/documents",
    Icon: IoDocumentTextOutline
  },
  {
    name: "Shared",
    to: "shared",
    pathname: "/home/shared",
    Icon: IoDocumentTextOutline
  },
  {
    name: "About Us",
    to: "about",
    pathname: "/home/about",
    Icon: IoInformationCircleOutline
  }
]

export default routes
