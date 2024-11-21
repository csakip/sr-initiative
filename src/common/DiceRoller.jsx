import { useCallback, useRef, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useHotkeys } from "react-hotkeys-hook";
import { roll } from "../dice";
import Dice from "./Dice";
import RollNotification from "../classes/RollNotification";

export function useDiceRoller() {
  const teens = useRef(0);
  const [notifications, setNotifications] = useState([]);
  const rollDice = useCallback(
    (diceValue, title) => {
      const r = roll(teens.current * 10 + diceValue);
      const newNotification = new RollNotification(
        title || teens.current * 10 + diceValue + "d",
        r
      );
      teens.current = 0;
      setNotifications((prev) => [...prev, newNotification]);
      setTimeout(
        () =>
          setNotifications((notifications) =>
            notifications.filter((n) => n.id !== newNotification.id)
          ),
        10000
      );
    },
    [setNotifications]
  );

  const onHotkeys = useCallback(
    (e) => {
      const key = e.key === "0" ? 10 : parseInt(e.key);
      rollDice(key);
    },
    [rollDice]
  );

  const setTeens = useCallback(
    (e) => {
      teens.current = e.key === "t" ? 1 : 2;
    },
    [rollDice]
  );

  useHotkeys("1,2,3,4,5,6,7,8,9,0", onHotkeys);
  useHotkeys("esc", () => setNotifications([]));
  useHotkeys("t,h", setTeens);

  return {
    notifications,
    setNotifications,
    DiceRoller,
    rollDice,
  };

  function DiceRoller() {
    return (
      <ToastContainer position='bottom-end' className='p-3'>
        {notifications.map((notification) => (
          <Toast
            bg={notification.roll.glitch ? "danger" : "success"}
            key={notification.id}
            onClose={() => setNotifications(notifications.filter((n) => n !== notification))}>
            <Toast.Header>
              <strong className='me-auto'>{notification.title}</strong>
              <small className='text-muted'>{notification.time.toLocaleTimeString("hu-HU")}</small>
            </Toast.Header>
            <Toast.Body>{notification.roll && <Dice roll={notification.roll} />}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    );
  }
}
