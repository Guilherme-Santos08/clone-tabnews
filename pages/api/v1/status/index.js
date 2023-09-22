function status(request, response) {
  response.status(200).json({ message: "DzScript é acima da média" });
}

export default status;
