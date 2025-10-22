import { useParams } from "react-router";

const SingleUserProfile = () => {
  const users = [
    { id: 1, fullName: "Alex Johnson" },
    { id: 2, fullName: "Michael Smith" },
    { id: 3, fullName: "Emily Davis" },
    { id: 4, fullName: "David Brown" },
    { id: 5, fullName: "Sarah Wilson" },
    { id: 6, fullName: "James Taylor" },
    { id: 7, fullName: "Jessica Lee" },
  ];
  const params = useParams();
  console.log("params", params);
  const userId = params.userId;
  const user = users.find((user) => user.id === parseInt(userId));
  return (
    <div className="container my-5">
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          viewBox="10.5 6 14 14"
          fill="none"
          class="size-5"
        >
          <path
            opacity="0.5"
            d="M24 13.3906C24 16.9805 21.0899 19.8906 17.5 19.8906C13.9101 19.8906 11 16.9805 11 13.3906C11 9.80077 13.9101 6.89062 17.5 6.89062C21.0899 6.89062 24 9.80077 24 13.3906Z"
            fill="#8C68FF"
            fill-opacity="0.3"
          ></path>
          <circle
            opacity="0.3"
            cx="17.5015"
            cy="13.3921"
            r="4.04054"
            fill="#8366FF"
          ></circle>
          <g filter="url(#filter0_d_17442_9005)">
            <circle
              cx="17.5027"
              cy="13.3856"
              r="1.93243"
              fill="#8366FF"
            ></circle>
          </g>
          <defs>
            <filter
              id="filter0_d_17442_9005"
              x="0.594645"
              y="0.221374"
              width="33.8146"
              height="33.8166"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              ></feColorMatrix>
              <feOffset dy="3.74392"></feOffset>
              <feGaussianBlur stdDeviation="7.48783"></feGaussianBlur>
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
              ></feColorMatrix>
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_17442_9005"
              ></feBlend>
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_17442_9005"
                result="shape"
              ></feBlend>
            </filter>
          </defs>
        </svg>
      </span>
      <h2> Single User Profile component</h2>
      <h4>{user?.fullName}</h4>
    </div>
  );
};

export default SingleUserProfile;
