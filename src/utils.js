export const API = `/api`;

export const formatNumber = (number) =>
  new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);

export const matchQuery = (str, query) => {
 	query = query?.split('')?.reduce((a, b) => `${a}.*${b}`, '');
	return new RegExp(query)?.test(str);
};

export const duplicateCheck = (a, b) => 
  a?.name === b?.name && a?.id === b?.id && a?.unitPrice === b?.unitPrice;


export const fetchRequest = (url)=> fetch(url).then((res)=>res.json());
