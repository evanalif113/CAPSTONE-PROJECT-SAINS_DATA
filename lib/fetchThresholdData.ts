// lib/fetchThresholdData.ts
import {
  database,
  ref,
  query,
  orderByKey,
  limitToLast,
  get
} from "@/lib/firebaseConfig";

interface ThresholdValue {
  temperature: number;
  humidity: number;
  light: number;
  moisture: number;
}