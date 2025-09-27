import { Link, useParams } from "react-router"

export default function UserDash() {
  const { userid, orgid } = useParams()
  return (
    <div>
      <h1>
        UserId :: {userid}
        OrgId :: {orgid}
      </h1>
      <div>
        <Link to="media" relative="path">
          <div
            className="font-bold underline"
          >Media</div>
        </Link>
      </div>
    </div>
  );
}
