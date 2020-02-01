export default ({ title }: { title: string }) => (
  <div className="title">
    <style jsx>{`
      .title {
        user-select: none;
        background: rgba(0, 0, 0, 0.5);
        padding: 5px 10px;
        font-size: 13px;
        color: white;
        min-width: 100px;
      }

      .title:hover {
        background: black;
      }
    `}</style>
    {title}
  </div>
);
