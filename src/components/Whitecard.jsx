import React from "react";

function Whitecard({ title, status, msg, isL, onClickMsg, trackingLink }) {
  return (
    <div
      className={`rounded-3xl  w-full ${
        isL ? "" : "border-2 border-[#7a92fb]"
      }  items-center p-4 mb-3`}
    >
      <div className="flex  w-full gap-5">
        <div className="text-left pt-4">
          <p
            className=" font-semibold text-lg"
            style={{ color: isL ? "#7a92fb" : null }}
          >
            {title}{" "}
          </p>
        </div>

        <div className="pt-2 text-left ">
          {!isL && <p className=" font-semibold text-sm ">{status}</p>}
          {isL ? (
            <p
              className=""
              style={{ color: "#7a92fb", marginTop: 10, cursor: "pointer" }}
              onClick={onClickMsg}
            >
              {msg}
            </p>
          ) : (
            <p
              className=" text-sm"
              style={{
                color: status == "Complete" ? "#7a92fb" : null,
              }}
            >
              {status == "Complete" ? (
                <a href={trackingLink} target="_blank">
                  {msg}
                </a>
              ) : (
                msg
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Whitecard;
