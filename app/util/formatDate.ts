const formatDate = (dateString: string) => {
  const now = new Date();
  const target = new Date(dateString);
  const diff = (now.getTime() - target.getTime()) / 1000;

  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`;

  return new Intl.DateTimeFormat("ko-KR").format(target);
};

export default formatDate;
