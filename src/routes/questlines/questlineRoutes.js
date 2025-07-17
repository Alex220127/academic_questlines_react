import QuestlineCreator from "../../pages/QuestlineCreator"
import QuestlineDetails from "../../pages/QuestlineDetails"
import TeacherQuestline from "../../pages/TeacherQuestlines"

const routes = [
  {
    path: '/questlines',
    Component: TeacherQuestline
  },
  {
    path: '/questlines/create',
    Component: QuestlineCreator
  },
  {
    path: "/questline-details",
    Component: QuestlineDetails
  }
]

export default routes
