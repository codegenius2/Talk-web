// import {proxy} from "valtio"
// import {useSnapshot} from "valtio/react"
// import {useCallback} from "react"
//
// type Person = {
//     name: string
//     age: number
// }
//
// type ExpState = {
//     person: Person
//     clicked: number
// }
//
// const expState = proxy<ExpState>(
//     {
//         clicked: 0,
//         person: {
//             name: "kate",
//             age: 50
//         }
//     }
// )
//
// type Props = {
//     personProxy: Person
//     // personProxy: Person
// }
// export const PersonWindow: React.FC<Props> = ({personProxy}) => {
//     const personSnp = useSnapshot(personProxy)
//     const addMyOwnName = useCallback(() => {
//         personProxy.name += "x"
//     }, [personProxy])
//     return (
//         <div className="flex flex-col justify-center items-center w-1/2 h-1/2">
//             <div className="flex gap-3">
//                 <button onClick={addMyOwnName}>
//                     addMyOwnName
//                 </button>
//                 name: {personSnp.name}
//             </div>
//             <div>
//                 age: {personProxy.age}
//             </div>
//         </div>
//     )
// }
//
// // 4. to always get the latest updates on a state.field alternation, you must subscribe root state
// export const Experiment = () => {
//     // const personSnp =  useSnapshot(expState.person)
//     // const expSnp =  useSnapshot(expState)
//
//     const addClicked = useCallback(() => {
//         expState.clicked++
//     }, [])
//
//     const personAddAge = useCallback(() => {
//         expState.person.age++
//     }, [])
//
//     const changePerson = useCallback(() => {
//         expState.person = {
//             name: "jack",
//             age: 1999
//         }
//     }, [])
//
//     return (
//         <div className="flex items-center justify-center w-screen h-screen bg-neutral-400 ">
//             <div className="flex justify-center items-center w-1/2 h-1/2 gap-10">
//                 <div className="flex flex-col justify-center items-center">
//                     <button
//                         onClick={addClicked}
//                     >
//                         add clicked: {expState.clicked}
//                     </button>
//                     <button
//                         onClick={changePerson}
//                     >
//                         change person
//                     </button>
//                     <button
//                         onClick={personAddAge}
//                     >
//                         add age
//                     </button>
//                 </div>
//                 <PersonWindow personProxy={expState.person}/>
//                 {/*    personProxy={expState.person}*/}
//             </div>
//         </div>
//     )
// }
//
// // 3. useSnapshot(state.field) only subscribe a single object, it doesn't know if state.field is alternated
// // if you want to get latest alternation of state.field, you can subscribe the whole state: useSnapshot(state)
// // or you have to trigger const fieldSnap = useSnapshot(state.field) to fresh again, the funny thing is this is usually
// // triggered by modifying the old proxy,
// // type Props = {
// //     personSnp: Person
// //     // personProxy: Person
// // }
// // export const PersonWindow: React.FC<Props> = ({personSnp}) => {
// //     return (
// //         <div className="flex flex-col justify-center items-center w-1/2 h-1/2">
// //             <div>
// //                 name: {personSnp.name}
// //             </div>
// //             <div>
// //                 name: {personSnp.age}
// //             </div>
// //         </div>
// //     )
// // }
// //
// // export const Experiment = () => {
// //     const personSnp =  useSnapshot(expState.person)
// //     const expSnp =  useSnapshot(expState)
// //
// //     const addClicked = useCallback(() => {
// //         expState.clicked ++
// //     }, [])
// //
// //     const personAddAge = useCallback(() => {
// //         expState.person.age++
// //     }, [])
// //
// //     const changePerson = useCallback(() => {
// //         expState.person = {
// //             name: "jack",
// //             age: 1999
// //         }
// //     }, [])
// //
// //     return (
// //         <div className="flex items-center justify-center w-screen h-screen bg-neutral-400 ">
// //             <div className="flex justify-center items-center w-1/2 h-1/2 gap-10">
// //                 <div className="flex flex-col justify-center items-center">
// //                     <button
// //                         onClick={addClicked}
// //                     >
// //                         add clicked: {expState.clicked}
// //                     </button>
// //                     <button
// //                         onClick={changePerson}
// //                     >
// //                         change person
// //                     </button>
// //                     <button
// //                         onClick={personAddAge }
// //                     >
// //                         add age
// //                     </button>
// //                 </div>
// //                 <PersonWindow  personSnp={expState.person} />
// //             {/*    personProxy={expState.person}*/}
// //             </div>
// //         </div>
// //     )
// // }
//
//
// // 1. using proxy as pros fields, the result is random
// // export const Experiment = () => {
// //     const expSnp = useSnapshot(expState)
// //
// //     const addClicked = useCallback(() => {
// //         expState.clicked ++
// //     }, [])
// //
// //     const addPersonAddAge = useCallback(() => {
// //         expState.person.age++
// //     }, [])
// //
// //     const changePerson = useCallback(() => {
// //         expState.person = {
// //             name: "jack",
// //             age: 1999
// //         }
// //     }, [])
// //
// //     return (
// //         <div className="flex items-center justify-center w-screen h-screen bg-neutral-400 ">
// //             <div className="flex justify-center items-center w-1/2 h-1/2 gap-10">
// //                 <div className="flex flex-col justify-center items-center">
// //                     <button
// //                         onClick={addClicked}
// //                     >
// //                         add clicked: {expState.clicked}
// //                     </button>
// //                     <button
// //                         onClick={changePerson}
// //                     >
// //                         change person
// //                     </button>
// //                     <button
// //                         onClick={addPersonAddAge }
// //                     >
// //                         add age
// //                     </button>
// //                 </div>
// //                 <PersonWindow personProxy={expState.person}/>
// //             </div>
// //         </div>
// //     )
// // }
//
//
// // 2. alternating object field of a state, all the sub components can't not get updates on the new object
// // export const Experiment = () => {
// //
// //     const addClicked = useCallback(() => {
// //         expState.clicked ++
// //     }, [])
// //
// //     const addPersonAddAge = useCallback(() => {
// //         expState.person.age++
// //     }, [])
// //
// //     const changePerson = useCallback(() => {
// //         expState.person = {
// //             name: "jack",
// //             age: 1999
// //         }
// //     }, [])
// //
// //     return (
// //         <div className="flex items-center justify-center w-screen h-screen bg-neutral-400 ">
// //             <div className="flex justify-center items-center w-1/2 h-1/2 gap-10">
// //                 <div className="flex flex-col justify-center items-center">
// //                     <button
// //                         onClick={addClicked}
// //                     >
// //                         add clicked: {expState.clicked}
// //                     </button>
// //                     <button
// //                         onClick={changePerson}
// //                     >
// //                         change person
// //                     </button>
// //                     <button
// //                         onClick={addPersonAddAge }
// //                     >
// //                         add age
// //                     </button>
// //                 </div>
// //                 <PersonWindow personProxy={expState.person}/>
// //             </div>
// //         </div>
// //     )
// // }
