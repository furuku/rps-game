import { startConsumer } from "./consumer";

let started = false;

if (!started) {
  started = true;
  startConsumer();
}