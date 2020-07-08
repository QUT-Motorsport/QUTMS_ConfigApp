import { useState, useEffect } from "react";
import { get } from "../ajax";
import { QmsData, ChannelHeader } from "./types";

export default function useQmsData(filename: string): QmsData | null {
  const [qmsData, setQmsData] = useState<QmsData | null>(null);

  useEffect(() => {
    get(`qms/${filename}`).then((data: QmsData) => {
      data.channels.forEach((channel: ChannelHeader, idx: number) => {
        channel.idx = idx;
      });

      setQmsData({
        ...data,
        channels: data.channels,
        filename,
        messages: [],
      });
    });
  }, [filename]);

  return qmsData;
}
