export default ({ selected, name }: { selected: boolean; name: string }) => (
  <div className="tab">
    <style jsx>{`
      .tab {
        user-select: none;
        padding: 5px 10px;
        font-size: 13px;
        color: white;
        min-width: 100px;
        margin-right: 2px;
        margin-top: 2px;
        transform: perspective(4px) rotateX(1deg);
        transform-origin: bottom left;
        background: ${selected
          ? "rgb(0,192,255) !important"
          : "rgba(0,0,0, 0.5)"};
      }

      .tab:hover {
        background: black;
      }
    `}</style>
    {name}
  </div>
);
