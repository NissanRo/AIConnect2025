const colors = [
    { bg: '63B3ED', text: 'FFFFFF' },
    { bg: 'F6AD55', text: 'FFFFFF' },
    { bg: '48BB78', text: 'FFFFFF' },
    { bg: 'F56565', text: 'FFFFFF' },
    { bg: 'ECC94B', text: '000000' },
    { bg: '9F7AEA', text: 'FFFFFF' },
    { bg: 'ED64A6', text: 'FFFFFF' },
    { bg: '4299E1', text: 'FFFFFF' },
    { bg: '38B2AC', text: 'FFFFFF' },
    { bg: 'A0AEC0', text: 'FFFFFF' },
    { bg: '718096', text: 'FFFFFF' },
    { bg: 'd53f8c', text: 'FFFFFF' },
    { bg: '805ad5', text: 'FFFFFF' },
    { bg: '3182ce', text: 'FFFFFF' },
    { bg: '2f855a', text: 'FFFFFF' },
    { bg: 'c53030', text: 'FFFFFF' },
    { bg: 'b7791f', text: 'FFFFFF' },
];

export function getColor(index: number) {
    return colors[index % colors.length];
}
